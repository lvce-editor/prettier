import * as Format from '../Format/Format.js'
import * as PrettierWorkerCommandType from '../PrettierWorkerCommandType/PrettierWorkerCommandType.js'

export const commandMap = {
  [PrettierWorkerCommandType.Format]: Format.format,
}
