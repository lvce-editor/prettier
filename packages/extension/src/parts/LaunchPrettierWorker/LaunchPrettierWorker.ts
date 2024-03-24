import * as Command from '../Command/Command.ts'
import * as PrettierWorkerUrl from '../PrettierWorkerUrl/PrettierWorkerUrl.ts'

export const launchPrettierWorker = async () => {
  // @ts-expect-error
  const rpc = await vscode.createRpc({
    type: 'worker',
    url: PrettierWorkerUrl.prettierWorkerUrl,
    name: 'Prettier Worker',
    execute: Command.execute,
    contentSecurityPolicy: "default-src 'none'; script-src 'self'",
  })
  return rpc
}
