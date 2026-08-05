import { deepStrictEqual, match, strictEqual } from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { format } from '../src/parts/Prettier/Prettier.ts'

void test('loads configured plugins relative to the workspace', async () => {
  const workspace = await mkdtemp(join(tmpdir(), 'prettier-plugin-test-'))
  const prettierRoot = join(workspace, 'node_modules', 'prettier')
  const pluginRoot = join(workspace, 'node_modules', 'prettier-plugin-test')
  await mkdir(prettierRoot, { recursive: true })
  await mkdir(pluginRoot, { recursive: true })
  await writeFile(
    join(prettierRoot, 'package.json'),
    JSON.stringify({ main: 'index.js', name: 'prettier', version: '1.0.0' }),
  )
  await writeFile(
    join(prettierRoot, 'index.js'),
    `module.exports = {
  version: '3.6.0',
  async resolveConfig() { return { plugins: ['prettier-plugin-test'] } },
  async resolveConfigFile() { return ${JSON.stringify(join(workspace, '.prettierrc.json'))} },
  format(content, options) { return options.plugins[0].format(content) },
}`,
  )
  await writeFile(
    join(pluginRoot, 'package.json'),
    JSON.stringify({ main: 'index.js', name: 'prettier-plugin-test' }),
  )
  await writeFile(
    join(pluginRoot, 'index.js'),
    `module.exports = { format(content) { return content.toUpperCase() } }`,
  )
  const filePath = join(workspace, 'test.example')
  await writeFile(filePath, 'hello')
  await writeFile(
    join(workspace, '.prettierrc.json'),
    JSON.stringify({ plugins: ['prettier-plugin-test'] }),
  )

  const result = await format(filePath, 'hello')

  strictEqual(result.status, 'formatted')
  if (result.status !== 'formatted') {
    throw new Error(JSON.stringify(result))
  }
  strictEqual(result.formattedText, 'HELLO')
  strictEqual(result.version, '3.6.0')
  match(result.path, /node_modules\/prettier\/index\.js$/)
})

void test('returns unavailable when local Prettier is not installed', async () => {
  const workspace = await mkdtemp(join(tmpdir(), 'prettier-missing-test-'))

  const result = await format(join(workspace, 'test.js'), 'const x=1')

  deepStrictEqual(result, {
    reason: 'not found',
    status: 'unavailable',
  })
})
