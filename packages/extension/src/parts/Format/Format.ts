import * as PrettierWorker from '../PrettierWorker/PrettierWorker.ts'
import * as PrettierWorkerCommandType from '../PrettierWorkerCommandType/PrettierWorkerCommandType.ts'

export const format = async (uri, text) => {
  const rpc = await PrettierWorker.getInstance()
  const result = await rpc.invoke(PrettierWorkerCommandType.Format, uri, text)
  return result
}
