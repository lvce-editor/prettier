import * as LaunchPrettierWorker from '../LaunchPrettierWorker/LaunchPrettierWorker.ts'

interface State {
  ipc: any
  rpcPromise: any
}

export const state: State = {
  ipc: undefined,
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

export const invoke = async (method, ...params) => {
  const rpc = await getInstance()
  const result = await rpc.invoke(method, ...params)
  return result
}
