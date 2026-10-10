import { FileSystemWorker } from '@lvce-editor/rpc-registry'
import { dirname } from '../PrettierIgnore/Dirname/Dirname.ts'
import { getAncestorDirectories } from '../PrettierIgnore/GetAncestorDirectories/GetAncestorDirectories.ts'
import { join } from '../PrettierIgnore/Join/Join.ts'

export const resolvePackageConfig = async (
  uri: string,
): Promise<Record<string, unknown>> => {
  const url = uri.includes('://') ? new URL(uri) : undefined
  const path = url ? url.pathname : uri.replaceAll('\\', '/')
  const directories = getAncestorDirectories(dirname(path)).toReversed()
  for (const directory of directories) {
    const packagePath = join(directory, 'package.json')
    const packageUri = url ? new URL(packagePath, url).href : packagePath
    let content: string
    try {
      content = await FileSystemWorker.readFile(packageUri)
    } catch {
      continue
    }
    const { prettier } = JSON.parse(content)
    if (prettier === undefined) {
      continue
    }
    if (!prettier || typeof prettier !== 'object' || Array.isArray(prettier)) {
      throw new Error(
        `Expected a Prettier configuration object in ${packageUri}`,
      )
    }
    return prettier
  }
  return {}
}
