import * as PrettierWorker from '../PrettierWorker/PrettierWorker.js'

export const format = async (uri, text) => {
  const rpc = await PrettierWorker.getInstance()
  const result = await rpc.invoke('Prettier.format', uri, text)
  return result
}
