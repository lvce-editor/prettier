import { createNodeRpc } from '@lvce-editor/api'

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

const state: {
  rpcPromise: ReturnType<typeof createNodeRpc> | undefined
} = {
  rpcPromise: undefined,
}

const getRpc = (): ReturnType<typeof createNodeRpc> => {
  state.rpcPromise ||= createNodeRpc({
    id: 'builtin.prettier.local',
  })
  return state.rpcPromise
}

export const format = async (
  uri: string,
  content: string,
): Promise<LocalPrettierResult> => {
  try {
    const rpc = await getRpc()
    return await rpc.invoke('LocalPrettier.format', uri, content)
  } catch (error) {
    return {
      reason: `local Prettier process unavailable: ${error}`,
      status: 'unavailable',
    }
  }
}
