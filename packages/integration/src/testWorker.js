// TODO add integration tests for git worker
// send and receive messages

import { startWorker } from './startWorker.js'

export const testWorker = async ({ execMap, config = {}, quickPick = () => {} }) => {
  const invocations = []
  const rpc = {
    invoke(...args) {
      invocations.push(args)
      if (args[0] === 'Exec.exec') {
        const result = execMap[args[2][0]]
        if (!result) {
          throw new Error(`exec command not found ${args[2][0]}`)
        }
        return result
      } else if (args[0] === 'Config.getGitPaths') {
        // @ts-ignore
        return config.gitPaths
      } else if (args[0] === 'Config.getWorkspaceFolder') {
        // @ts-ignore
        return config.workspaceFolder
      } else if (args[0] === 'QuickPick.show') {
        return quickPick()
      } else {
        throw new Error(`unknown command ${args[0]}`)
      }
    },
  }
  const worker = await startWorker(rpc)
  return {
    execute(...args) {
      return worker.execute(...args)
    },
    invocations,
  }
}
