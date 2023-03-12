import * as CommandMap from '../CommandMap/CommandMap.js'

export const execute = async (method, ...params) => {
  const fn = CommandMap.getFn(method)
  // @ts-ignore
  const result = await fn(...params)
  return result
}
