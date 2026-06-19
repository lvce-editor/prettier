import ignore from 'ignore'
import type { Ignore, Options } from 'ignore'
import { dirname } from '../Dirname/Dirname.ts'
import { getAncestorDirectories } from '../GetAncestorDirectories/GetAncestorDirectories.ts'
import { getRelativePath } from '../GetRelativePath/GetRelativePath.ts'
import { join } from '../Join/Join.ts'
import { normalizeUri } from '../NormalizeUri/NormalizeUri.ts'
import type { ReadFile } from '../ReadFile/ReadFile.ts'
import { readIgnoreFile } from '../ReadIgnoreFile/ReadIgnoreFile.ts'

const PrettierIgnoreFileName = '.prettierignore'
const createIgnore = ignore as unknown as (options?: Options) => Ignore

export const isIgnoredWithReadFile = async (
  uri: string,
  readFileFn: ReadFile,
): Promise<boolean> => {
  const file = normalizeUri(uri)
  const directories = getAncestorDirectories(dirname(file))
  let ignored = false
  for (const directory of directories) {
    const ignoreFileUri = join(directory, PrettierIgnoreFileName)
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
