import { expect, test } from '@jest/globals'
import { FileSystemWorker } from '@lvce-editor/rpc-registry'
import { resolvePackageConfig } from '../src/parts/ResolvePackageConfig/ResolvePackageConfig.ts'

for (const root of [
  '/sample',
  'memfs:///sample',
  'memfs://workspace/sample',
  'file:///sample',
]) {
  test(`finds package settings for ${root} without a local Prettier installation`, async () => {
    using mockRpc = FileSystemWorker.registerMockRpc({
      'FileSystem.readFile': async (uri: string) => {
        if (uri === `${root}/package.json`) {
          return JSON.stringify({
            prettier: { semi: false, singleQuote: true, printWidth: 150 },
          })
        }
        throw new Error('File not found')
      },
    })
    expect(await resolvePackageConfig(`${root}/src/main.ts`)).toEqual({
      semi: false,
      singleQuote: true,
      printWidth: 150,
    })
    expect(mockRpc.invocations).toEqual([
      ['FileSystem.readFile', `${root}/src/package.json`],
      ['FileSystem.readFile', `${root}/package.json`],
    ])
  })
}

test('uses the nearest configuration and reads updated settings on the next format', async () => {
  let semi = false
  using mockRpc = FileSystemWorker.registerMockRpc({
    'FileSystem.readFile': async (uri: string) => {
      if (uri === 'memfs:///sample/src/package.json')
        return JSON.stringify({ prettier: { semi } })
      throw new Error('Unexpected parent lookup')
    },
  })
  expect(await resolvePackageConfig('memfs:///sample/src/main.ts')).toEqual({
    semi: false,
  })
  semi = true
  expect(await resolvePackageConfig('memfs:///sample/src/main.ts')).toEqual({
    semi: true,
  })
  expect(mockRpc.invocations).toHaveLength(2)
})

test('continues past packages without Prettier settings', async () => {
  using mockRpc = FileSystemWorker.registerMockRpc({
    'FileSystem.readFile': async (uri: string) =>
      uri === 'memfs:///sample/package.json'
        ? '{"prettier":{"semi":false}}'
        : '{"name":"nested"}',
  })
  expect(await resolvePackageConfig('memfs:///sample/src/main.ts')).toEqual({
    semi: false,
  })
  expect(mockRpc.invocations).toHaveLength(2)
})

test('uses defaults when no package provides settings', async () => {
  using mockRpc = FileSystemWorker.registerMockRpc({
    'FileSystem.readFile': async () => {
      throw new Error('File not found')
    },
  })
  expect(await resolvePackageConfig('memfs:///sample/main.ts')).toEqual({})
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.readFile', 'memfs:///sample/package.json'],
    ['FileSystem.readFile', 'memfs:///package.json'],
  ])
})

test('reports malformed package settings', async () => {
  using mockRpc = FileSystemWorker.registerMockRpc({
    'FileSystem.readFile': async () => '{"prettier":false}',
  })
  await expect(resolvePackageConfig('memfs:///sample/main.ts')).rejects.toThrow(
    'Expected a Prettier configuration object',
  )
  expect(mockRpc.invocations).toHaveLength(1)
})
