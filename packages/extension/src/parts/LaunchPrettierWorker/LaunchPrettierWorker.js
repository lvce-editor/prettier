import * as PrettierWorkerUrl from '../PrettierWorkerUrl/PrettierWorkerUrl.js'
import * as Command from '../Command/Command.js'

export const launchPrettierWorker = async () => {
  const workerUrl = PrettierWorkerUrl.getPrettierWorkerUrl()
  const rpc = await vscode.createRpc({
    type: 'worker',
    url: workerUrl,
    name: 'Prettier Worker',
    execute: Command.execute,
  })
  return rpc
}
