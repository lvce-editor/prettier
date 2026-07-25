/* eslint-disable @typescript-eslint/no-floating-promises */
import { strictEqual, match } from 'node:assert'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, test } from 'node:test'
import { pathToFileURL } from 'node:url'
import { formatLocal } from '../src/prettierNode.ts'

const temporaryDirectories: string[] = []
const defaultPackageJson = {
  exports: './index.js',
  name: 'prettier',
  type: 'module',
}

const createTemporaryDirectory = async (): Promise<string> => {
  const directory = await mkdtemp(join(tmpdir(), 'lvce-prettier-'))
  temporaryDirectories.push(directory)
  return directory
}

const writeModule = async (
  root: string,
  source: string,
  packageJson: Readonly<Record<string, unknown>> = defaultPackageJson,
): Promise<void> => {
  const moduleDirectory = join(root, 'node_modules', 'prettier')
  await mkdir(moduleDirectory, { recursive: true })
  await writeFile(
    join(moduleDirectory, 'package.json'),
    JSON.stringify(packageJson),
  )
  await writeFile(join(moduleDirectory, 'index.js'), source)
}

afterEach(async () => {
  const directories = [...temporaryDirectories]
  temporaryDirectories.length = 0
  await Promise.all(
    directories.map((directory) =>
      rm(directory, { force: true, recursive: true }),
    ),
  )
})

test('returns unavailable when local Prettier is not found', async () => {
  const root = await createTemporaryDirectory()
  const result = await formatLocal(join(root, 'test.js'), 'let  x=1')

  strictEqual(result.status, 'unavailable')
  if (result.status === 'unavailable') {
    match(result.reason, /not found/)
  }
})

test('formats with an ESM local Prettier', async () => {
  const root = await createTemporaryDirectory()
  await writeModule(
    root,
    `export const version = '3.6.0'
export const format = async () => 'formatted by esm'`,
  )

  const result = await formatLocal(join(root, 'test.js'), 'input')

  strictEqual(result.status, 'formatted')
  if (result.status === 'formatted') {
    strictEqual(result.formattedText, 'formatted by esm')
    strictEqual(result.version, '3.6.0')
  }
})

test('formats with a CommonJS local Prettier', async () => {
  const root = await createTemporaryDirectory()
  await writeModule(
    root,
    `module.exports = {
  version: '3.5.0',
  format() {
    return 'formatted by commonjs'
  },
}`,
    {
      main: './index.js',
      name: 'prettier',
      type: 'commonjs',
    },
  )

  const result = await formatLocal(join(root, 'test.js'), 'input')

  strictEqual(result.status, 'formatted')
  if (result.status === 'formatted') {
    strictEqual(result.formattedText, 'formatted by commonjs')
  }
})

test('passes the resolved config and filepath to local Prettier', async () => {
  const root = await createTemporaryDirectory()
  await writeModule(
    root,
    `export const version = '4.0.0-alpha.10'
export const resolveConfig = async () => ({ marker: 'from-config' })
export const format = async (content, options) =>
  options.marker + ':' + options.filepath + ':' + content`,
  )
  const filePath = join(root, 'src', 'test.js')

  const result = await formatLocal(filePath, 'input')

  strictEqual(result.status, 'formatted')
  if (result.status === 'formatted') {
    strictEqual(result.formattedText, `from-config:${filePath}:input`)
  }
})

test('supports file URIs', async () => {
  const root = await createTemporaryDirectory()
  await writeModule(
    root,
    `export const version = '3.0.0'
export const format = async () => 'formatted file uri'`,
  )
  const uri = pathToFileURL(join(root, 'test.js')).href

  const result = await formatLocal(uri, 'input')

  strictEqual(result.status, 'formatted')
})

test('does not resolve local modules for non-file URIs', async () => {
  const result = await formatLocal('memfs:///workspace/test.js', 'input')

  strictEqual(result.status, 'unavailable')
  if (result.status === 'unavailable') {
    match(result.reason, /unsupported document URI/)
  }
})

test('uses the nearest local Prettier', async () => {
  const root = await createTemporaryDirectory()
  const nested = join(root, 'packages', 'app')
  await writeModule(
    root,
    `export const version = '3.0.0'
export const format = async () => 'root prettier'`,
  )
  await writeModule(
    nested,
    `export const version = '3.0.0'
export const format = async () => 'nested prettier'`,
  )

  const result = await formatLocal(join(nested, 'src', 'test.js'), 'input')

  strictEqual(result.status, 'formatted')
  if (result.status === 'formatted') {
    strictEqual(result.formattedText, 'nested prettier')
  }
})

test('supports Prettier 2', async () => {
  const root = await createTemporaryDirectory()
  await writeModule(
    root,
    `export const version = '2.8.8'
export const format = async () => 'old prettier'`,
  )

  const result = await formatLocal(join(root, 'test.js'), 'input')

  strictEqual(result.status, 'formatted')
  if (result.status === 'formatted') {
    strictEqual(result.formattedText, 'old prettier')
  }
})

test('rejects Prettier 1 as unsupported', async () => {
  const root = await createTemporaryDirectory()
  await writeModule(
    root,
    `export const version = '1.19.1'
export const format = async () => 'unsupported prettier'`,
  )

  const result = await formatLocal(join(root, 'test.js'), 'input')

  strictEqual(result.status, 'unavailable')
  if (result.status === 'unavailable') {
    match(result.reason, /unsupported Prettier version 1.19.1/)
  }
})

test('rejects malformed versions', async () => {
  const root = await createTemporaryDirectory()
  await writeModule(
    root,
    `export const version = 'latest'
export const format = async () => 'invalid prettier'`,
  )

  const result = await formatLocal(join(root, 'test.js'), 'input')

  strictEqual(result.status, 'unavailable')
})

test('rejects a module without a format function', async () => {
  const root = await createTemporaryDirectory()
  await writeModule(root, `export const version = '3.0.0'`)

  const result = await formatLocal(join(root, 'test.js'), 'input')

  strictEqual(result.status, 'unavailable')
  if (result.status === 'unavailable') {
    match(result.reason, /invalid Prettier module/)
  }
})

test('handles module import errors', async () => {
  const root = await createTemporaryDirectory()
  await writeModule(root, `throw new Error('import failed')`)

  const result = await formatLocal(join(root, 'test.js'), 'input')

  strictEqual(result.status, 'unavailable')
  if (result.status === 'unavailable') {
    match(result.reason, /import failed/)
  }
})

test('reports local formatting errors', async () => {
  const root = await createTemporaryDirectory()
  await writeModule(
    root,
    `export const version = '3.0.0'
export const format = async () => {
  throw new Error('format failed')
}`,
  )

  const result = await formatLocal(join(root, 'test.js'), 'input')

  strictEqual(result.status, 'format-error')
  if (result.status === 'format-error') {
    match(result.message, /format failed/)
  }
})

test('reports local configuration errors', async () => {
  const root = await createTemporaryDirectory()
  await writeModule(
    root,
    `export const version = '3.0.0'
export const resolveConfig = async () => {
  throw new Error('config failed')
}
export const format = async () => 'unreachable'`,
  )

  const result = await formatLocal(join(root, 'test.js'), 'input')

  strictEqual(result.status, 'format-error')
  if (result.status === 'format-error') {
    match(result.message, /config failed/)
  }
})

test('reports non-string formatter results', async () => {
  const root = await createTemporaryDirectory()
  await writeModule(
    root,
    `export const version = '3.0.0'
export const format = async () => undefined`,
  )

  const result = await formatLocal(join(root, 'test.js'), 'input')

  strictEqual(result.status, 'format-error')
  if (result.status === 'format-error') {
    match(result.message, /non-string result/)
  }
})
