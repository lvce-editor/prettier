import type { ReadFile } from '../ReadFile/ReadFile.ts'

export const readIgnoreFile = async (
  readFileFn: ReadFile,
  uri: string,
): Promise<string> => {
  try {
    return await readFileFn(uri)
  } catch {
    return ''
  }
}
