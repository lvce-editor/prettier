import * as Format from '../Format/Format.ts'
import * as PrettierWorkerCommandType from '../PrettierWorkerCommandType/PrettierWorkerCommandType.ts'

export const commandMap = {
  [PrettierWorkerCommandType.Format]: Format.format,
}
