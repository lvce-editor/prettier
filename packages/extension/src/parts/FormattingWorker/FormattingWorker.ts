import { createRpc } from '@lvce-editor/api'

const workerUrl = new URL('formattingWorkerMain.js', import.meta.url).href
let rpcPromise: ReturnType<typeof createRpc> | undefined

const getRpc = (): ReturnType<typeof createRpc> => {
  rpcPromise ||= createRpc({
    name: 'Prettier Formatting',
    url: workerUrl,
  }).catch((error) => {
    rpcPromise = undefined
    throw error
  })
  return rpcPromise
}

export const format = async (
  uri: string,
  content: string,
  options: Record<string, unknown>,
): Promise<string> => {
  const rpc = await getRpc()
  return rpc.invoke('Prettier.format', uri, content, options)
}
