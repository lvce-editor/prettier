import { WebWorkerRpcClient } from '@lvce-editor/rpc'
import * as CommandMap from '../CommandMap/CommandMap.ts'

export const listen = async (): Promise<void> => {
  await WebWorkerRpcClient.create({
    commandMap: CommandMap.commandMap,
  })
}
