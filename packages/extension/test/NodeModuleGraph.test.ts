import { expect, test } from '@jest/globals'
import {
  build,
  findPackageRoot,
  resolveModule,
  resolvePackageSubpath,
  type FileSystem,
} from '../src/parts/NodeModuleGraph/NodeModuleGraph.ts'

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

test('findPackageRoot returns the nearest package', async () => {
  const fileSystem = createFileSystem({
    '/workspace/node_modules/prettier/package.json': '{}',
    '/workspace/packages/app/node_modules/prettier/package.json': '{}',
  })

  await expect(
    findPackageRoot('prettier', '/workspace/packages/app/src', fileSystem),
  ).resolves.toBe('/workspace/packages/app/node_modules/prettier')
})

test('resolvePackageSubpath selects the browser CommonJS export', async () => {
  const packageRoot = '/workspace/node_modules/prettier'
  const fileSystem = createFileSystem({
    [`${packageRoot}/package.json`]: JSON.stringify({
      exports: {
        '.': {
          browser: {
            default: './standalone.js',
            import: './standalone.mjs',
          },
          default: './index.mjs',
          require: './index.cjs',
        },
      },
    }),
    [`${packageRoot}/standalone.js`]: 'module.exports = {}',
    [`${packageRoot}/standalone.mjs`]: 'export default {}',
  })

  await expect(
    resolvePackageSubpath(packageRoot, '', fileSystem, [
      'browser',
      'require',
      'default',
      'import',
    ]),
  ).resolves.toBe(`${packageRoot}/standalone.js`)
})

test('build transforms ESM and resolves relative and package imports', async () => {
  const fileSystem = createFileSystem({
    '/workspace/node_modules/plugin/index.cjs':
      'module.exports = { name: "plugin" }',
    '/workspace/node_modules/plugin/package.json': JSON.stringify({
      main: './index.cjs',
    }),
    '/workspace/prettier.config.js': `import value from './value.js'
import plugin from 'plugin'
export default { plugin, value }`,
    '/workspace/value.js': `export default 42`,
  })

  const graph = await build(
    {
      config: '/workspace/prettier.config.js',
    },
    fileSystem,
  )

  expect(graph.entries).toEqual({
    config: '/workspace/prettier.config.js',
  })
  expect(
    graph.modules
      .map((module) => module.id)
      .toSorted((left, right) => left.localeCompare(right)),
  ).toEqual([
    '/workspace/node_modules/plugin/index.cjs',
    '/workspace/prettier.config.js',
    '/workspace/value.js',
  ])
  expect(
    graph.modules.find(
      (module) => module.id === '/workspace/prettier.config.js',
    ),
  ).toMatchObject({
    dependencies: {
      './value.js': '/workspace/value.js',
      plugin: '/workspace/node_modules/plugin/index.cjs',
    },
  })
})

test('build transforms a standalone ESM default export', async () => {
  const graph = await build(
    {
      prettier: '/workspace/node_modules/prettier/index.js',
    },
    createFileSystem({
      '/workspace/node_modules/prettier/index.js':
        'export default { version: "3.7.0", format() {} }',
    }),
  )

  expect(graph.modules[0].source).not.toContain('export default')
  expect(graph.modules[0].source).toContain('exports.default')
})

test('resolveModule rejects Node builtins and URL imports', async () => {
  const fileSystem = createFileSystem({})

  await expect(
    resolveModule('node:fs', '/workspace/config.js', fileSystem),
  ).rejects.toThrow('not available in the sandbox')
  await expect(
    resolveModule(
      'https://example.com/plugin.js',
      '/workspace/config.js',
      fileSystem,
    ),
  ).rejects.toThrow('not available in the sandbox')
})

test('build transforms computed dynamic imports into sandbox require calls', async () => {
  const graph = await build(
    {
      main: '/workspace/main.cjs',
    },
    createFileSystem({
      '/workspace/main.cjs': `module.exports = async (name) => import(name)`,
    }),
  )

  expect(graph.modules[0].source).not.toContain('import(')
  expect(graph.modules[0].source).toContain('require(')
})
