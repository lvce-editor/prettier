import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const state = {
  ipc: undefined,
  /**
   * @type {any}
   */
  rpcPromise: undefined,
}

const createIpc = async () => {
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorker,
  })
  return ipc
}

const createRpc = async () => {
  const ipc = await createIpc()
  return {
    ipc,
    invoke() {},
  }
}

const getOrCreateRpc = async () => {
  if (!state.rpcPromise) {
    state.rpcPromise = createRpc()
  }
  return state.rpcPromise
}

export const getInstance = async () => {
  const ipc = await getOrCreateRpc()
  return ipc
}
