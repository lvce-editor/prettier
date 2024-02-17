import * as LaunchPrettierWorker from '../LaunchPrettierWorker/LaunchPrettierWorker.js'

export const state = {
  ipc: undefined,
  /**
   * @type {any}
   */
  rpcPromise: undefined,
}

const getOrCreateRpc = async () => {
  if (!state.rpcPromise) {
    state.rpcPromise = LaunchPrettierWorker.launchPrettierWorker()
  }
  return state.rpcPromise
}

export const getInstance = async () => {
  const rpc = await getOrCreateRpc()
  return rpc
}
