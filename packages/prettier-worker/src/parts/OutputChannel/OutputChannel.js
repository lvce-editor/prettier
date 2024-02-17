import * as Rpc from '../Rpc/Rpc.js'

export const log = (message) => {
  Rpc.invoke('OutputChannel.log', message)
}
