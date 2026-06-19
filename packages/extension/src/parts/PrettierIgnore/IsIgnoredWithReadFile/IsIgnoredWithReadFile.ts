import type { Ignore, Options } from 'ignore'
import ignore from 'ignore'
import type { ReadFile } from '../ReadFile/ReadFile.ts'
import { dirname } from '../Dirname/Dirname.ts'
import { getAncestorDirectories } from '../GetAncestorDirectories/GetAncestorDirectories.ts'
import { getRelativePath } from '../GetRelativePath/GetRelativePath.ts'
import { join } from '../Join/Join.ts'
import { normalizeUri } from '../NormalizeUri/NormalizeUri.ts'
import { readIgnoreFile } from '../ReadIgnoreFile/ReadIgnoreFile.ts'

const PrettierIgnoreFileName = '.prettierignore'
const createIgnore = ignore as unknown as (options?: Options) => Ignore
const UriProtocolPattern = /^[a-zA-Z][a-zA-Z\d+.-]*:\/\//

const getIgnoreFileUri = (uri: string, path: string): string => {
  if (!UriProtocolPattern.test(uri)) {
    return path
  }
  try {
    const url = new URL(uri)
    const authority = url.host ? `${url.protocol}//${url.host}` : `${url.protocol}//`
    const absolutePath = path.startsWith('/') ? path : `/${path}`
    return `${authority}${absolutePath}`
  } catch {
    return path
  }
}

export const isIgnoredWithReadFile = async (
  uri: string,
  readFileFn: ReadFile,
): Promise<boolean> => {
  const file = normalizeUri(uri)
  const directories = getAncestorDirectories(dirname(file))
  let ignored = false
  for (const directory of directories) {
    const ignoreFilePath = join(directory, PrettierIgnoreFileName)
    const ignoreFileUri = getIgnoreFileUri(uri, ignoreFilePath)
    const content = await readIgnoreFile(readFileFn, ignoreFileUri)
    if (!content) {
      continue
    }
    const relativePath = getRelativePath(directory, file)
    const result = createIgnore({ allowRelativePaths: true })
      .add(content)
      .test(relativePath)
    if (result.ignored) {
      ignored = true
    } else if (result.unignored) {
      ignored = false
    }
  }
  return ignored
}
