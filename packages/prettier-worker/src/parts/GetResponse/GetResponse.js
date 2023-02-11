import * as Format from '../Format/Format.js'
import * as PrettierWorkerCommandType from '../PrettierWorkerCommandType/PrettierWorkerCommandType.js'

export const getResponse = async (method, params) => {
  if (method === PrettierWorkerCommandType.Format) {
    const uri = params[0]
    const content = params[1]
    const result = await Format.format(uri, content)
    return result
  }
  return undefined
}
