import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const root = `${__dirname}/../../..`

const workerPath = join(
  root,
  'packages',
  'prettier-worker',
  'src',
  'prettierWorkerMain.js',
)

export const startWorker = async (rpc) => {
  const workerUrl = pathToFileURL(workerPath).toString()
  globalThis.rpc = rpc
  const module = await import(workerUrl)
  const { commandMap } = module
  return {
    execute(commandId, ...args) {
      const command = commandMap[commandId]
      if (!command) {
        throw new Error(`command not found ${commandId}`)
      }
      return command(...args)
    },
  }
}
