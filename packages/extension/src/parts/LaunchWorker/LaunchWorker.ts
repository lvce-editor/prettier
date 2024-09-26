import * as Command from '../Command/Command.ts'

export const launchWorker = async ({ id }) => {
  // @ts-expect-error
  const rpc = await vscode.createRpc({
    id,
    execute: Command.execute,
  })
  return rpc
}
