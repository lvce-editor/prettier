import * as Rpc from '../Rpc/Rpc.ts'

export const log = (message) => {
  Rpc.invoke('OutputChannel.log', message)
}
