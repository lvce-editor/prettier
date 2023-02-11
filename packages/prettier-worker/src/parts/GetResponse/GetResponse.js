import * as Format from '../Format/Format.js'

export const getResponse = async (method, params) => {
  if (method === 'Format.format') {
    const uri = params[0]
    const content = params[1]
    const result = await Format.format(uri, content)
    return result
  }
  return undefined
}
