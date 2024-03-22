// TODO add integration tests for git worker
// send and receive messages

import { startWorker } from './startWorker.js'

export const testWorker = async ({
  execMap,
  config = {},
  quickPick = () => {},
}) => {
  const invocations: any[] = []
  const rpc = {
    invoke(...args) {
      invocations.push(args)
      if (args[0] === 'OutputChannel.log') {
        // ignore
      } else {
        throw new Error(`unknown command ${args[0]}`)
      }
    },
  }
  const worker = await startWorker(rpc)
  return {
    execute(commandId: string, ...args: any[]) {
      return worker.execute(commandId, ...args)
    },
    invocations,
  }
}
