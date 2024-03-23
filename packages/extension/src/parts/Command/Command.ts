import * as CommandMap from '../CommandMap/CommandMap.ts'

export const execute = async (method, ...params) => {
  const fn = CommandMap.getFn(method)
  // @ts-ignore
  const result = await fn(...params)
  return result
}
