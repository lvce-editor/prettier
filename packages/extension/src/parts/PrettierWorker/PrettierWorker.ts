import { log } from '../CommandMap/CommandMap.ts'

// @ts-ignore
const rpc = vscode.createRpc({
  id: 'builtin.prettier.prettier-worker',
  commandMap: {
    'OutputChannel.log': log,
  },
})

export const invoke = (method, ...params) => {
  return rpc.invoke(method, ...params)
}
