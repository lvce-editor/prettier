import { WebWorkerRpcClient } from '@lvce-editor/rpc'
import { format } from './parts/BundledFormat/BundledFormat.ts'

await WebWorkerRpcClient.create({
  commandMap: {
    'Prettier.format': format,
  },
})
