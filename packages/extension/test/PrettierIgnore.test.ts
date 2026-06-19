import { expect, test } from '@jest/globals'
import { dirname } from '../src/parts/PrettierIgnore/Dirname/Dirname.ts'
import { getAncestorDirectories } from '../src/parts/PrettierIgnore/GetAncestorDirectories/GetAncestorDirectories.ts'
import { getRelativePath } from '../src/parts/PrettierIgnore/GetRelativePath/GetRelativePath.ts'
import { join } from '../src/parts/PrettierIgnore/Join/Join.ts'
import { normalizeUri } from '../src/parts/PrettierIgnore/NormalizeUri/NormalizeUri.ts'
import * as PrettierIgnore from '../src/parts/PrettierIgnore/PrettierIgnore.ts'
import { readIgnoreFile } from '../src/parts/PrettierIgnore/ReadIgnoreFile/ReadIgnoreFile.ts'
import { trimTrailingSlash } from '../src/parts/PrettierIgnore/TrimTrailingSlash/TrimTrailingSlash.ts'

const createReadFile = (
  files: Partial<Record<string, string>>,
): ((uri: string) => Promise<string>) => {
  return async (uri: string): Promise<string> => {
    const content = files[uri]
    if (content === undefined) {
      throw new Error(`file not found: ${uri}`)
    }
    return content
  }
}

const readMissingFile = async (): Promise<string> => {
  throw new Error('file not found')
}

test('root prettierignore ignores root file glob', async () => {
  const readFile = createReadFile({
    '/workspace/.prettierignore': 'ignored.js',
  })

  expect(
    await PrettierIgnore.isIgnoredWithReadFile(
      '/workspace/ignored.js',
      readFile,
    ),
  ).toBe(true)
})

test('root prettierignore does not ignore non-matching file', async () => {
  const readFile = createReadFile({
    '/workspace/.prettierignore': 'ignored.js',
  })

  expect(
    await PrettierIgnore.isIgnoredWithReadFile('/workspace/keep.js', readFile),
  ).toBe(false)
})

test('prettierignore supports comments and blank lines', async () => {
  const readFile = createReadFile({
    '/workspace/.prettierignore': '# generated files\n\nignored.js\n',
  })

  expect(
    await PrettierIgnore.isIgnoredWithReadFile(
      '/workspace/ignored.js',
      readFile,
    ),
  ).toBe(true)
})

test('prettierignore supports directory globs', async () => {
  const readFile = createReadFile({
    '/workspace/.prettierignore': 'dist/**',
  })

  expect(
    await PrettierIgnore.isIgnoredWithReadFile(
      '/workspace/dist/output.js',
      readFile,
    ),
  ).toBe(true)
})

test('prettierignore supports negated globs', async () => {
  const readFile = createReadFile({
    '/workspace/.prettierignore': '*.js\n!keep.js',
  })

  expect(
    await PrettierIgnore.isIgnoredWithReadFile('/workspace/keep.js', readFile),
  ).toBe(false)
})

test('nested prettierignore can unignore a parent rule', async () => {
  const readFile = createReadFile({
    '/workspace/.prettierignore': 'src/*.js',
    '/workspace/src/.prettierignore': '!keep.js',
  })

  expect(
    await PrettierIgnore.isIgnoredWithReadFile(
      '/workspace/src/keep.js',
      readFile,
    ),
  ).toBe(false)
})

test('missing prettierignore files do not block formatting', async () => {
  expect(
    await PrettierIgnore.isIgnoredWithReadFile(
      '/workspace/keep.js',
      readMissingFile,
    ),
  ).toBe(false)
})

test('normalizeUri converts file uris to paths', () => {
  expect(normalizeUri('file:///workspace/a%20b/file.js')).toBe(
    '/workspace/a b/file.js',
  )
})

test('normalizeUri converts windows file uris to paths', () => {
  expect(normalizeUri('file:///C:/workspace/file.js')).toBe(
    'C:/workspace/file.js',
  )
})

test('normalizeUri normalizes backslashes', () => {
  expect(normalizeUri('C:\\workspace\\file.js')).toBe('C:/workspace/file.js')
})

test('trimTrailingSlash preserves root', () => {
  expect(trimTrailingSlash('/')).toBe('/')
})

test('trimTrailingSlash removes trailing slashes', () => {
  expect(trimTrailingSlash('/workspace/src///')).toBe('/workspace/src')
})

test('dirname returns parent directory', () => {
  expect(dirname('/workspace/src/file.js')).toBe('/workspace/src')
})

test('dirname returns root parent', () => {
  expect(dirname('/file.js')).toBe('/')
})

test('getAncestorDirectories returns absolute ancestors', () => {
  expect(getAncestorDirectories('/workspace/src')).toEqual([
    '/',
    '/workspace',
    '/workspace/src',
  ])
})

test('getAncestorDirectories returns relative ancestors', () => {
  expect(getAncestorDirectories('workspace/src')).toEqual([
    'workspace',
    'workspace/src',
  ])
})

test('join handles root directory', () => {
  expect(join('/', '.prettierignore')).toBe('/.prettierignore')
})

test('join handles empty directory', () => {
  expect(join('', '.prettierignore')).toBe('.prettierignore')
})

test('getRelativePath returns path relative to directory', () => {
  expect(getRelativePath('/workspace/src', '/workspace/src/file.js')).toBe(
    'file.js',
  )
})

test('getRelativePath returns root-relative path for root directory', () => {
  expect(getRelativePath('/', '/workspace/src/file.js')).toBe(
    'workspace/src/file.js',
  )
})

test('readIgnoreFile returns empty content when read fails', async () => {
  expect(
    await readIgnoreFile(readMissingFile, '/workspace/.prettierignore'),
  ).toBe('')
})
