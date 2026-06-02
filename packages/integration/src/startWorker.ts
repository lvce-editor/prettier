import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const root = `${__dirname}/../../..`

const formatPath = join(
  root,
  'packages',
  'extension',
  'src',
  'parts',
  'Format',
  'Format.ts',
)

export const startWorker = async () => {
  const formatUrl = pathToFileURL(formatPath).toString()
  const Format = await import(formatUrl)
  return {
    execute(commandId: string, ...args: any[]) {
      if (commandId !== 'Prettier.format') {
        throw new Error(`command not found ${commandId}`)
      }
      return Format.format(...args)
    },
  }
}
