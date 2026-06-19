import { expect, test } from '@jest/globals'
import * as PrettierIgnore from '../src/parts/PrettierIgnore/PrettierIgnore.ts'

const createReadFile = (
  files: Record<string, string>,
): ((uri: string) => Promise<string>) => {
  return async (uri: string): Promise<string> => {
    const content = files[uri]
    if (content === undefined) {
      throw new Error(`file not found: ${uri}`)
    }
    return content
  }
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
  const readFile = async (): Promise<string> => {
    throw new Error('file not found')
  }

  expect(
    await PrettierIgnore.isIgnoredWithReadFile('/workspace/keep.js', readFile),
  ).toBe(false)
})
