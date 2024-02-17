import { CommandNotFoundError } from '../CommandNotFoundError/CommandNotFoundError.js'

const log = (message) => {
  console.info(message)
}

export const getFn = (method) => {
  switch (method) {
    case 'OutputChannel.log':
      return log
    default:
      throw new CommandNotFoundError(method)
  }
}
