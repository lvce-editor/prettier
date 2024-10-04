import * as PrettierWorker from '../PrettierWorker/PrettierWorker.ts'
import * as PrettierWorkerCommandType from '../PrettierWorkerCommandType/PrettierWorkerCommandType.ts'

export const format = async (uri, text) => {
  const result = await PrettierWorker.invoke(
    PrettierWorkerCommandType.Format,
    uri,
    text,
  )
  return result
}
