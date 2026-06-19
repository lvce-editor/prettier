// TODO add integration tests for git worker
// send and receive messages

import { startWorker } from './startWorker.js'

export const testWorker = async ({
  config = {},
  execMap,
  quickPick = () => {},
}) => {
  const invocations: any[] = []
  const worker = await startWorker()
  return {
    execute(commandId: string, ...args: any[]) {
      return worker.execute(commandId, ...args)
    },
    invocations,
  }
}
