import { createNodeRpc } from '@lvce-editor/api'
import type { LocalPrettierResult } from '../LocalPrettier/LocalPrettier.ts'

const state: {
  rpcPromise: ReturnType<typeof createNodeRpc> | undefined
} = {
  rpcPromise: undefined,
}

const getRpc = (): ReturnType<typeof createNodeRpc> => {
  state.rpcPromise ||= createNodeRpc({
    id: 'builtin.prettier.node',
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
    const rpc = await getRpc()
    return await rpc.invoke('Prettier.format', filePath, content)
  } catch (error) {
    return {
      reason: `native Prettier unavailable: ${error}`,
      status: 'unavailable',
    }
  }
}
