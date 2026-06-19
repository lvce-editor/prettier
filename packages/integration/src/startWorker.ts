import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

interface FormattingEdit {
  readonly endOffset: number
  readonly inserted: string
  readonly startOffset: number
}

type FormatArguments = readonly [uri: string, content: string]

export interface Worker {
  readonly execute: (
    commandId: string,
    ...args: FormatArguments
  ) => Promise<FormattingEdit>
}

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

export const startWorker = async (): Promise<Worker> => {
  const formatUrl = pathToFileURL(formatPath).toString()
  const Format = await import(formatUrl)
  return {
    execute(
      commandId: string,
      ...args: FormatArguments
    ): Promise<FormattingEdit> {
      if (commandId !== 'Prettier.format') {
        throw new Error(`command not found ${commandId}`)
      }
      return Format.format(...args)
    },
  }
}
