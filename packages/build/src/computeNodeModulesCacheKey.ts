import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { root } from './root.ts'

const locations: readonly string[] = [
  'lerna.json',
  'package-lock.json',
  'packages/build/package-lock.json',
  'packages/e2e/package-lock.json',
  'packages/extension/package-lock.json',
  '.github/workflows/ci.yml',
  '.github/workflows/release.yml',
  'packages/build/src/computeNodeModulesCacheKey.ts',
]

const getAbsolutePath = (relativePath: string): string => {
  return join(root, relativePath)
}

const getContent = (absolutePath: string): Promise<string> => {
  return readFile(absolutePath, 'utf8')
}

export const computeHash = (contents: readonly string[] | string): string => {
  const hash = createHash('sha1')
  if (typeof contents === 'string') {
    hash.update(contents)
  } else {
    for (const content of contents) {
      hash.update(content)
    }
  }
  return hash.digest('hex')
}

const computeCacheKey = async (
  locations: readonly string[],
): Promise<string> => {
  const absolutePaths = locations.map(getAbsolutePath)
  const contents = await Promise.all(absolutePaths.map(getContent))
  const hash = computeHash(contents)
  return hash
}

const main = async (): Promise<void> => {
  const hash = await computeCacheKey(locations)
  process.stdout.write(hash)
}

main()
