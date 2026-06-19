// TODO add integration tests for git worker
// send and receive messages

import { startWorker } from './startWorker.js'
import * as PrettierConfigFileSystem from '../../extension/src/parts/PrettierConfigFileSystem/PrettierConfigFileSystem.js'

const createFileSystemProvider = (execMap) => {
  return {
    async exists(uri: string) {
      if (!execMap['FileSystem.exists']) {
        return false
      }
      return execMap['FileSystem.exists'](uri)
    },
    async readFile(uri: string) {
      if (!execMap['FileSystem.readFile']) {
        throw new Error(`FileSystem.readFile not mocked for ${uri}`)
      }
      return execMap['FileSystem.readFile'](uri)
    },
  }
}

export const testWorker = async ({
  config = {},
  execMap,
  quickPick = () => {},
}) => {
  PrettierConfigFileSystem.setProvider(createFileSystemProvider(execMap))
  const invocations: any[] = []
  const worker = await startWorker()
  return {
    execute(commandId: string, ...args: any[]) {
      return worker.execute(commandId, ...args)
    },
    invocations,
  }
}
