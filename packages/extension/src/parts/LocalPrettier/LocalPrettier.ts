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
  rpcPromise: ReturnType<typeof createRpc> | undefined
} = {
  loadPromises: Object.create(null),
  rpcPromise: undefined,
}

const getRpc = (): ReturnType<typeof createRpc> => {
  state.rpcPromise ||= createRpc({
    contentSecurityPolicy: `default-src 'none'; script-src 'self' 'unsafe-eval';`,
    name: 'Node.js Sandbox',
    url: workerUrl,
  })
  return state.rpcPromise
}

const toFilePath = (uri: string): string | undefined => {
  if (uri.startsWith('file:')) {
    const url = new URL(uri)
    const path = decodeURIComponent(url.pathname)
    return /^\/[A-Za-z]:\//.test(path) ? path.slice(1) : path
  }
  if (/^[A-Za-z][A-Za-z\d+.-]*:/.test(uri)) {
    return undefined
  }
  return uri.replaceAll('\\', '/')
}

export const format = async (
  uri: string,
  content: string,
): Promise<LocalPrettierResult> => {
  const filePath = toFilePath(uri)
  if (!filePath) {
    return {
      reason: `unsupported document URI ${uri}`,
      status: 'unavailable',
    }
  }
  try {
    const loaded = await LocalPrettierModuleGraph.load(filePath)
    if (loaded.status === 'unavailable') {
      return loaded
    }
    const rpc = await getRpc()
    const { cacheKey } = loaded.request
    state.loadPromises[cacheKey] ||= rpc.invoke(
      'NodeJsSandbox.loadLocalPrettier',
      loaded.request,
    )
    await state.loadPromises[cacheKey]
    return await rpc.invoke(
      'NodeJsSandbox.formatWithLocalPrettier',
      cacheKey,
      filePath,
      content,
      loaded.request.parser,
    )
  } catch (error) {
    return {
      reason: `local Prettier sandbox unavailable: ${error}`,
      status: 'unavailable',
    }
  }
}
