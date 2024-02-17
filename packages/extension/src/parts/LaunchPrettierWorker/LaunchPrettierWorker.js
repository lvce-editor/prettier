import * as PrettierWorkerUrl from '../PrettierWorkerUrl/PrettierWorkerUrl.js'

export const launchPrettierWorker = async () => {
  const workerUrl = PrettierWorkerUrl.getPrettierWorkerUrl()
  const rpc = await vscode.createRpc({
    type: 'worker',
    url: workerUrl,
    name: 'Prettier Worker',
  })
  return rpc
}
