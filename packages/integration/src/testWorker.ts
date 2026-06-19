// TODO add integration tests for git worker
// send and receive messages

import { startWorker } from './startWorker.js'

interface TestWorkerOptions {
  readonly config?: Record<string, unknown>
  readonly execMap?: Record<string, unknown>
  readonly quickPick?: () => void
}

interface TestWorker {
  readonly execute: (
    commandId: string,
    ...args: readonly unknown[]
  ) => Promise<unknown>
  readonly invocations: readonly unknown[]
}

export const testWorker = async ({
  config = {},
  execMap,
  quickPick = () => {},
}: TestWorkerOptions): Promise<TestWorker> => {
  const invocations: unknown[] = []
  const worker = await startWorker()
  return {
    execute(commandId: string, ...args: readonly unknown[]): Promise<unknown> {
      return worker.execute(commandId, ...args)
    },
    invocations,
  }
}
