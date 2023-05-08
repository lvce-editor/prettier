import * as PrettierWorkerUrl from '../PrettierWorkerUrl/PrettierWorkerUrl.js'

export const state = {
  ipc: undefined,
  /**
   * @type {any}
   */
  rpcPromise: undefined,
}

const createRpc = async () => {
  const workerUrl = PrettierWorkerUrl.getPrettierWorkerUrl()
  const rpc = await vscode.createRpc({
    type: 'worker',
    url: workerUrl,
    name: 'Prettier Worker',
  })
  return rpc
}

const getOrCreateRpc = async () => {
  if (!state.rpcPromise) {
    state.rpcPromise = createRpc()
  }
  return state.rpcPromise
}

export const getInstance = async () => {
  const rpc = await getOrCreateRpc()
  return rpc
}
