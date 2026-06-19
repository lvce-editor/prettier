// TODO add integration tests for git worker
// send and receive messages

import { startWorker } from './startWorker.js'

type TestWorkerOptions = {
  readonly config?: object
  readonly execMap?: object
  readonly quickPick?: () => void
}

type TestWorker = {
  readonly execute: (commandId: string, ...args: readonly any[]) => Promise<any>
  readonly invocations: readonly any[]
}

export const testWorker = async ({
  config = {},
  execMap,
  quickPick = (): void => {},
}: TestWorkerOptions): Promise<TestWorker> => {
  const invocations: any[] = []
  const worker = await startWorker()
  return {
    execute(commandId: string, ...args: readonly any[]): Promise<any> {
      return worker.execute(commandId, ...args)
    },
    invocations,
  }
}
