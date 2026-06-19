import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const root = `${__dirname}/../../..`

type Worker = {
  readonly execute: (commandId: string, ...args: readonly any[]) => Promise<any>
}

const formatPath = join(
  root,
  'packages',
  'extension',
  'src',
  'parts',
  'Format',
  'Format.ts',
)

export const startWorker = async (): Promise<Worker> => {
  const formatUrl = pathToFileURL(formatPath).toString()
  const Format = await import(formatUrl)
  return {
    execute(commandId: string, ...args: readonly any[]): Promise<any> {
      if (commandId !== 'Prettier.format') {
        throw new Error(`command not found ${commandId}`)
      }
      return Format.format(...args)
    },
  }
}
