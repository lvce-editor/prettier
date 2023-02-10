import * as Callback from '../Callback/Callback.js'
import * as RestoreJsonRpcError from '../RestoreJsonRpcError/RestoreJsonRpcError.js'

export const invoke = async (ipc, method, ...params) => {
  const responseMessage = await new Promise((resolve, reject) => {
    const callbackId = Callback.register(resolve, reject)
    ipc.send({
      jsonrpc: '2.0',
      method,
      params,
      id: callbackId,
    })
  })
  if ('error' in responseMessage) {
    const restoredError = RestoreJsonRpcError.restoreJsonRpcError(
      responseMessage.error
    )
    throw restoredError
  }
  if ('result' in responseMessage) {
    return responseMessage.result
  }

  throw new Error('unexpected response message')
}
