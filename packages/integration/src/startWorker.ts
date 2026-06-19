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

interface Worker {
  readonly execute: (
    commandId: string,
    ...args: readonly unknown[]
  ) => Promise<unknown>
}

interface FormatModule {
  readonly format: (uri: string, content: string) => Promise<unknown>
}

export const startWorker = async (): Promise<Worker> => {
  const formatUrl = pathToFileURL(formatPath).toString()
  const Format = (await import(formatUrl)) as FormatModule
  return {
    execute(commandId: string, ...args: readonly unknown[]): Promise<unknown> {
      if (commandId !== 'Prettier.format') {
        throw new Error(`command not found ${commandId}`)
      }
      return Format.format(args[0] as string, args[1] as string)
    },
  }
}
