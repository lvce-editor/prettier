import { executeCommand } from '@lvce-editor/api'

export interface FileSystemProvider {
  readonly exists: (uri: string) => Promise<boolean>
  readonly readFile: (uri: string) => Promise<string>
}

const defaultProvider: FileSystemProvider = {
  async exists(uri) {
    try {
      return Boolean(await executeCommand('FileSystem.exists', uri))
    } catch {
      return false
    }
  },
  async readFile(uri) {
    return executeCommand('FileSystem.readFile', uri)
  },
}

let provider = defaultProvider

export const setProvider = (newProvider: FileSystemProvider): void => {
  provider = newProvider
}

export const resetProvider = (): void => {
  provider = defaultProvider
}

export const exists = (uri: string): Promise<boolean> => {
  return provider.exists(uri)
}

export const readFile = (uri: string): Promise<string> => {
  return provider.readFile(uri)
}
