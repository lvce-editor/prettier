import * as Callback from '../Callback/Callback.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as PrettierWorkerUrl from '../PrettierWorkerUrl/PrettierWorkerUrl.js'

export const state = {
  ipc: undefined,
  /**
   * @type {any}
   */
  rpcPromise: undefined,
}

const handleMessage = (event) => {
  const message = event.data
  if (message.id) {
    Callback.resolve(message.id, message)
  } else {
    console.log(message)
  }
}

const createIpc = async ({ url, name }) => {
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorker,
    url,
    name,
  })
  ipc.onmessage = handleMessage
  return ipc
}

const createRpc = async () => {
  const workerUrl = PrettierWorkerUrl.getPrettierWorkerUrl()
  const ipc = await createIpc({ url: workerUrl, name: 'Prettier Worker' })
  return {
    ipc,
    invoke(method, ...params) {
      return JsonRpc.invoke(this.ipc, method, ...params)
    },
  }
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
