import * as Format from '../Format/Format.js'
import * as PrettierWorkerCommandType from '../PrettierWorkerCommandType/PrettierWorkerCommandType.js'

const noop = (...args) => {
  return undefined
}

export const getFn = (method) => {
  switch (method) {
    case PrettierWorkerCommandType.Format:
      return Format.format
    default:
      return noop
  }
}
