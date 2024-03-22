export const invoke = async (method: string, ...params: any[]) => {
  const result = await globalThis.rpc.invoke(method, ...params)
  return result
}
