import * as GetResponse from '../GetResponse/GetResponse.js'

export const handleMessage = async (event) => {
  const message = event.data
  const response = await GetResponse.getResponse(message)
  event.target.postMessage(response)
}
