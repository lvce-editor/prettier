import { readFile } from '@lvce-editor/api'
import { isIgnoredWithReadFile } from '../IsIgnoredWithReadFile/IsIgnoredWithReadFile.ts'

export const isIgnored = (uri: string): Promise<boolean> => {
  return isIgnoredWithReadFile(uri, readFile)
}
