import * as Command from '../Command/Command.ts'

export const launchWorker = async ({ url, name, contentSecurityPolicy }) => {
  // @ts-expect-error
  const rpc = await vscode.createRpc({
    type: 'worker',
    url: url,
    name,
    execute: Command.execute,
    contentSecurityPolicy,
  })
  return rpc
}
