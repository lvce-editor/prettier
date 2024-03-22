export const invoke = async (method, ...params) => {
  const result = await globalThis.rpc.invoke(method, ...params)
  return result
}
