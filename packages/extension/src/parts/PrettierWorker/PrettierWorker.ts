import * as Command from '../Command/Command.ts'

// @ts-ignore
const rpc = vscode.createRpc({
  id: 'builtin.prettier.prettier-worker',
  execute: Command.execute,
})

export const getInstance = () => {
  return rpc
}

export const invoke = (method, ...params) => {
  return rpc.invoke(method, ...params)
}
