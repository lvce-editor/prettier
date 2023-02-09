import * as IpcChildType from './parts/IpcChildType/IpcChildType.js'
import * as IpcChild from './parts/IpcChild/IpcChild.js'
import * as Format from './parts/Format/Format.js'

const handleMessage = async (event) => {
  const message = event.data
  const { method, params, id } = message
  if (method === 'Prettier.format') {
    const uri = params[0]
    const content = params[1]
    const formattedText = await Format.format(uri, content)
    event.target.postMessage({
      jsonrpc: '2.0',
      id: id,
      result: formattedText,
    })
    console.log({ formattedText })
  }
  console.log('PRETTIER MESSAGE')
  console.log({ message })
}

const main = async () => {
  const ipc = await IpcChild.listen({
    method: IpcChildType.Auto(),
  })
  ipc.onmessage = handleMessage
  console.log('hello from prettier worker')
}

main()
