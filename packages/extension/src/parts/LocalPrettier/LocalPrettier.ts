import { createRpc } from '@lvce-editor/api'
import * as LocalPrettierModuleGraph from '../LocalPrettierModuleGraph/LocalPrettierModuleGraph.ts'

interface LocalPrettierFormattedResult {
  readonly formattedText: string
  readonly path: string
  readonly status: 'formatted'
  readonly version: string
}

interface LocalPrettierUnavailableResult {
  readonly reason: string
  readonly status: 'unavailable'
}

interface LocalPrettierFormatErrorResult {
  readonly message: string
  readonly status: 'format-error'
}

export type LocalPrettierResult =
  | LocalPrettierFormattedResult
  | LocalPrettierUnavailableResult
  | LocalPrettierFormatErrorResult

const workerUrl = new URL('nodejsSandboxWorkerMain.js', import.meta.url).href

const state: {
  readonly loadPromises: Record<string, Promise<void>>
  readonly loadRequests: Record<string, string>
  rpcPromise: ReturnType<typeof createRpc> | undefined
} = {
  loadPromises: Object.create(null),
  loadRequests: Object.create(null),
  rpcPromise: undefined,
}

const getRpc = (): ReturnType<typeof createRpc> => {
  state.rpcPromise ||= createRpc({
    contentSecurityPolicy: [
      "default-src 'none'",
      "script-src 'self' 'unsafe-eval'",
    ],
    name: 'Node.js Sandbox',
    url: workerUrl,
  })
  return state.rpcPromise
}

const normalizePath = (path: string): string => {
  const prefix = path.startsWith('/') ? '/' : ''
  const parts: string[] = []
  for (const part of path.replaceAll('\\', '/').split('/')) {
    if (!part || part === '.') {
      continue
    }
    if (part === '..') {
      parts.pop()
      continue
    }
    parts.push(part)
  }
  return `${prefix}${parts.join('/')}` || '/'
}

interface LocalPrettierDocumentContext {
  readonly cacheKeyNamespace: string
  readonly filePath: string
  readonly fileSystem: ReturnType<
    typeof LocalPrettierModuleGraph.createFileSystem
  >
}

const getPathFromUri = (url: URL): string => {
  const path = decodeURIComponent(url.pathname)
  return normalizePath(/^\/[A-Za-z]:\//.test(path) ? path.slice(1) : path)
}

export const getDocumentContext = (
  uri: string,
): LocalPrettierDocumentContext | undefined => {
  if (!/^[A-Za-z][A-Za-z\d+.-]*:/.test(uri)) {
    return {
      cacheKeyNamespace: 'file://',
      filePath: normalizePath(uri),
      fileSystem: LocalPrettierModuleGraph.createFileSystem(),
    }
  }
  try {
    const url = new URL(uri)
    return {
      cacheKeyNamespace: `${url.protocol}//${url.host}`,
      filePath: getPathFromUri(url),
      fileSystem: LocalPrettierModuleGraph.createFileSystem(url.href),
    }
  } catch {
    return undefined
  }
}

const toFileUri = (path: string): string => {
  const url = new URL('file:///')
  url.pathname = path.replace(/^([A-Za-z]:)/, '/$1')
  return url.href
}

export const format = async (
  uri: string,
  content: string,
  useFileWatcher = false,
): Promise<LocalPrettierResult> => {
  const context = getDocumentContext(uri)
  if (!context) {
    return {
      reason: `unsupported document URI ${uri}`,
      status: 'unavailable',
    }
  }
  try {
    const { cacheKeyNamespace, filePath, fileSystem } = context
    const loaded = await LocalPrettierModuleGraph.load(
      filePath,
      fileSystem,
      cacheKeyNamespace,
      useFileWatcher && cacheKeyNamespace === 'file://'
        ? toFileUri(filePath)
        : undefined,
    )
    if (loaded.status === 'unavailable') {
      return loaded
    }
    const rpc = await getRpc()
    const { cacheKey } = loaded.request
    const signature = JSON.stringify(loaded.request)
    // Keep replacing a module graph and formatting with it atomic for this key.
    const previous = state.loadPromises[cacheKey]
    const result = (async (): Promise<LocalPrettierResult> => {
      await previous
      if (state.loadRequests[cacheKey] !== signature) {
        await rpc.invoke('NodeJsSandbox.loadLocalPrettier', loaded.request)
        state.loadRequests[cacheKey] = signature
      }
      return rpc.invoke(
        'NodeJsSandbox.formatWithLocalPrettier',
        cacheKey,
        filePath,
        content,
        loaded.request.parser,
      )
    })()
    state.loadPromises[cacheKey] = (async (): Promise<void> => {
      try {
        await result
      } catch {
        // A failed format must not poison subsequent requests for this key.
      }
    })()
    return await result
  } catch (error) {
    return {
      reason: `local Prettier sandbox unavailable: ${error}`,
      status: 'unavailable',
    }
  }
}

export const dispose = async (): Promise<void> => {
  await LocalPrettierModuleGraph.dispose()
  for (const key of Object.keys(state.loadRequests)) {
    delete state.loadRequests[key]
    delete state.loadPromises[key]
  }
}
