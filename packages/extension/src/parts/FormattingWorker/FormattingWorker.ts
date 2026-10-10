import { createRpc } from '@lvce-editor/api'

const workerUrl = new URL('formattingWorkerMain.js', import.meta.url).href

export const createFormattingWorker = (create: typeof createRpc) => {
  let rpcPromise: ReturnType<typeof createRpc> | undefined

  const createInternal = async (): ReturnType<typeof createRpc> => {
    try {
      return await create({
        name: 'Prettier Formatting',
        url: workerUrl,
      })
    } catch (error) {
      rpcPromise = undefined
      throw error
    }
  }

  return async (
    uri: string,
    content: string,
    options: Record<string, unknown>,
  ): Promise<string> => {
    rpcPromise ||= createInternal()
    const rpc = await rpcPromise
    return rpc.invoke('Prettier.format', uri, content, options)
  }
}

export const format = createFormattingWorker(createRpc)
