// TODO add integration tests for git worker
// send and receive messages

import { startWorker } from './startWorker.js'

interface TestWorkerOptions {
  readonly config?: Readonly<Record<string, unknown>>
  readonly execMap: Readonly<Record<string, unknown>>
  readonly quickPick?: () => void
}

interface TestWorker {
  readonly execute: (
    commandId: string,
    uri: string,
    content: string,
  ) => Promise<unknown>
  readonly invocations: readonly unknown[]
}

const defaultQuickPick = (): void => {}

export const testWorker = async ({
  config = {},
  execMap,
  quickPick = defaultQuickPick,
}: TestWorkerOptions): Promise<TestWorker> => {
  const invocations: unknown[] = []
  const worker = await startWorker()
  return {
    execute(commandId: string, uri: string, content: string): Promise<unknown> {
      return worker.execute(commandId, uri, content)
    },
    invocations,
  }
}
