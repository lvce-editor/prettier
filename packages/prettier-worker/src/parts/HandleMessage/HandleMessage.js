import * as GetResponse from '../GetResponse/GetResponse.js'

export const handleMessage = async (event) => {
  const message = event.data
  const { method, params, id } = message
  const result = await GetResponse.getResponse(method, params)
  event.target.postMessage({
    jsonrpc: '2.0',
    id: id,
    result: result,
  })
}
