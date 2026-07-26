import { expect, test } from '@jest/globals'
import type { FileSystem } from '../src/parts/NodeModuleGraph/NodeModuleGraph.ts'
import { load } from '../src/parts/LocalPrettierModuleGraph/LocalPrettierModuleGraph.ts'

const createFileSystem = (
  files: Readonly<Record<string, string>>,
): FileSystem => {
  return {
    exists: async (path: string): Promise<boolean> => {
      return (
        path in files ||
        Object.keys(files).some((candidate) => candidate.startsWith(`${path}/`))
      )
    },
    readFile: async (path: string): Promise<string> => {
      if (!(path in files)) {
        throw new Error(`EISDIR: ${path}`)
      }
      return files[path]
    },
  }
}

test('builds local Prettier, plugin, and imported config modules into one graph', async () => {
  const prettierRoot = '/workspace/node_modules/prettier'
  const fileSystem = createFileSystem({
    '/workspace/node_modules/prettier-plugin-example/index.cjs':
      'module.exports = { parsers: {} }',
    '/workspace/node_modules/prettier-plugin-example/package.json':
      JSON.stringify({
        main: './index.cjs',
      }),
    '/workspace/prettier.config.js': `import plugin from 'prettier-plugin-example'
export default { plugins: [plugin], semi: false }`,
    [`${prettierRoot}/package.json`]: JSON.stringify({
      name: 'prettier',
    }),
    [`${prettierRoot}/plugins/babel.js`]: 'module.exports = { parsers: {} }',
    [`${prettierRoot}/plugins/estree.js`]: 'module.exports = { printers: {} }',
    [`${prettierRoot}/standalone.js`]:
      'module.exports = { version: "3.6.0", format() {} }',
  })

  const result = await load('/workspace/src/test.js', fileSystem)

  if (result.status !== 'available') {
    throw new Error(result.reason)
  }
  expect(result.request.configEntry).toBe('config')
  expect(result.request.pluginEntries).toEqual(['plugin:0', 'plugin:1'])
  expect(result.request.graph.modules.map((module) => module.id)).toEqual(
    expect.arrayContaining([
      '/workspace/node_modules/prettier-plugin-example/index.cjs',
      '/workspace/prettier.config.js',
      `${prettierRoot}/plugins/babel.js`,
      `${prettierRoot}/plugins/estree.js`,
      `${prettierRoot}/standalone.js`,
    ]),
  )
})

test('returns unavailable without a workspace Prettier package', async () => {
  const result = await load('/workspace/test.js', createFileSystem({}))

  expect(result).toEqual({
    reason: 'not found',
    status: 'unavailable',
  })
})
