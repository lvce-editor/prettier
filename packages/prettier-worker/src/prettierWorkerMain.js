import * as HandleMessage from './parts/HandleMessage/HandleMessage.js'
import * as IpcChild from './parts/IpcChild/IpcChild.js'
import * as IpcChildType from './parts/IpcChildType/IpcChildType.js'

const main = async () => {
  const ipc = await IpcChild.listen({
    method: IpcChildType.Auto(),
  })
  ipc.onmessage = HandleMessage.handleMessage
}

main()
