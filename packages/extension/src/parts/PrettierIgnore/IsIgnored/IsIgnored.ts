import { FileSystemWorker } from '@lvce-editor/rpc-registry'
import { isIgnoredWithReadFile } from '../IsIgnoredWithReadFile/IsIgnoredWithReadFile.ts'

export const isIgnored = (uri: string): Promise<boolean> => {
  return isIgnoredWithReadFile(uri, FileSystemWorker.readFile)
}
