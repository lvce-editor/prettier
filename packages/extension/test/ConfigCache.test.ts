import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'
import {
  handleExtensionManagementMessagePort,
  type FileSystemWatchEvent,
  type FileSystemWatchOptions,
} from '@lvce-editor/api'
import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { create } from '../src/parts/ConfigCache/ConfigCache.ts'

const close = jest.fn(async (_id: number) => {})
const watch = jest.fn(
  async (_id: number, _options: FileSystemWatchOptions) => {},
)
const state = {
  cache: create<number>(['.prettierrc', 'package.json']),
  mock: undefined as
    | ReturnType<typeof ExtensionManagementWorker.registerMockRpc>
    | undefined,
  platform: 2,
}
const cache = {
  dispose: (): Promise<void> => state.cache.dispose(),
  get: (
    uri: string | undefined,
    load: () => Promise<number>,
  ): Promise<number> => state.cache.get(uri, load),
}
const handler = async (event: FileSystemWatchEvent): Promise<void> => {
  await handleExtensionManagementMessagePort({
    commandMap: {},
    createMessagePortRpcClient: async ({ commandMap }) => {
      const invoke = commandMap['ExtensionApi.handleFileWatcherEvent'] as (
        id: number,
        event: FileSystemWatchEvent,
      ) => Promise<void>
      await invoke(watch.mock.calls.at(-1)![0], event)
    },
    port: null as unknown as MessagePort,
  })
}
beforeEach(() => {
  jest.clearAllMocks()
  state.platform = 2
  state.cache = create<number>(['.prettierrc', 'package.json'])
  state.mock = ExtensionManagementWorker.registerMockRpc({
    'Extensions.createFileSystemWatcher': watch,
    'Extensions.disposeFileSystemWatcher': close,
    'Extensions.executeCommand': async () => state.platform,
  })
})
afterEach(async () => {
  await cache.dispose()
  state.mock?.[Symbol.dispose]()
})

const uri = 'file:///workspace/src/test.js'

test('watches all search ancestors before discovery and reuses discovery for small edits', async () => {
  const load = jest.fn(async () => 1)
  expect(await cache.get(uri, load)).toBe(1)
  expect(await cache.get('file:///workspace/src/other.js', load)).toBe(1)
  expect(load).toHaveBeenCalledTimes(1)
  expect(watch).toHaveBeenCalledTimes(1)
  expect(watch.mock.calls[0][1]).toEqual({
    childNames: ['.prettierrc', 'package.json', 'src', 'workspace'],
    recursive: false,
    roots: ['file:///workspace/src/', 'file:///workspace/', 'file:///'],
  })
  await handler({ eventName: 'change', uri: 'file:///workspace/src/test.js' })
  await cache.get(uri, load)
  expect(load).toHaveBeenCalledTimes(1)
})

for (const eventName of ['create', 'change', 'delete', 'rename']) {
  test(`invalidates on config ${eventName}, including nearer configs`, async () => {
    let value = 1
    const load = jest.fn(async () => value)
    await cache.get(uri, load)
    value = 2
    await handler({ eventName, uri: 'file:///workspace/src/.prettierrc' })
    expect(await cache.get(uri, load)).toBe(2)
    expect(load).toHaveBeenCalledTimes(2)
  })
}

test('invalidates on package configuration and directory removal', async () => {
  const load = jest.fn(async () => 1)
  await cache.get(uri, load)
  await handler({ eventName: 'change', uri: 'file:///workspace/package.json' })
  await cache.get(uri, load)
  await handler({ eventName: 'delete', uri: 'file:///workspace/src' })
  await cache.get(uri, load)
  expect(load).toHaveBeenCalledTimes(3)
})

test('does not restore a stale result when a config changes during discovery', async () => {
  const deferred = Promise.withResolvers<number>()
  const load = jest
    .fn<() => Promise<number>>()
    .mockReturnValueOnce(deferred.promise)
    .mockResolvedValue(2)
  const pending = cache.get(uri, load)
  while (load.mock.calls.length === 0) await Promise.resolve()
  await handler({ eventName: 'change', uri: 'file:///workspace/.prettierrc' })
  deferred.resolve(1)
  expect(await pending).toBe(2)
  expect(await cache.get(uri, load)).toBe(2)
  expect(load).toHaveBeenCalledTimes(2)
})

test('falls back without watching for disabled or non-disk requests', async () => {
  const load = jest.fn(async () => 1)
  for (const target of [undefined, 'html:///test.js', 'memfs:///test.js']) {
    await cache.get(target, load)
    await cache.get(target, load)
  }
  expect(watch).not.toHaveBeenCalled()
  expect(load).toHaveBeenCalledTimes(6)
})

test('does not call unsupported watchers on web hosts', async () => {
  state.platform = 1
  const load = jest.fn(async () => 1)
  await cache.get(uri, load)
  await cache.get(uri, load)
  expect(watch).not.toHaveBeenCalled()
  expect(load).toHaveBeenCalledTimes(2)
})

test('keeps fresh lookups after setup failure without repeated registration attempts', async () => {
  watch.mockRejectedValueOnce(new Error('unsupported host'))
  const load = jest.fn(async () => 1)
  await cache.get(uri, load)
  await cache.get(uri, load)
  expect(load).toHaveBeenCalledTimes(2)
  expect(watch).toHaveBeenCalledTimes(1)
})

test('runtime failures discard cached values and dispose the watcher', async () => {
  let value = 1
  const load = jest.fn(async () => value)
  await cache.get(uri, load)
  value = 2
  await handler({
    error: { message: 'closed', name: 'Error' },
    eventName: 'error',
    uri: '',
  })
  expect(await cache.get(uri, load)).toBe(2)
  expect(await cache.get(uri, load)).toBe(2)
  expect(load).toHaveBeenCalledTimes(3)
  expect(close).toHaveBeenCalledTimes(1)
})

test('deactivation disposes subscriptions and clears cached values', async () => {
  const load = jest.fn(async () => 1)
  await cache.get(uri, load)
  await cache.dispose()
  await cache.get(uri, load)
  expect(close).toHaveBeenCalledTimes(1)
  expect(watch).toHaveBeenCalledTimes(2)
  expect(load).toHaveBeenCalledTimes(2)
})

test('bounds watcher registrations across unrelated document folders', async () => {
  for (let i = 0; i < 40; i++)
    await cache.get(`file:///workspace/${i}/test.js`, async () => i)
  expect(close).toHaveBeenCalledTimes(8)
})

test('a repeated local formatting load avoids configuration stats and reads and observes new nearer configs', async () => {
  const graph =
    await import('../src/parts/LocalPrettierModuleGraph/LocalPrettierModuleGraph.ts')
  const files: Record<string, string> = {
    '/workspace/.prettierrc': '{"semi":false}',
    '/workspace/node_modules/prettier/package.json': '{"name":"prettier"}',
    '/workspace/node_modules/prettier/standalone.js':
      'module.exports = { version: "3.6.0", format() {} }',
  }
  const exists = jest.fn(
    async (path: string) =>
      path in files ||
      Object.keys(files).some((name) => name.startsWith(`${path}/`)),
  )
  const readFile = jest.fn(async (path: string) => files[path])
  const fs = { exists, readFile }
  try {
    const first = await graph.load('/workspace/src/test.js', fs, 'file://', uri)
    expect(first).toMatchObject({ request: { config: { semi: false } } })
    exists.mockClear()
    readFile.mockClear()
    const second = await graph.load(
      '/workspace/src/test.js',
      fs,
      'file://',
      uri,
    )
    expect(second).toEqual(first)
    expect(
      exists.mock.calls.filter(
        ([path]) =>
          path.includes('prettierrc') || path.includes('prettier.config'),
      ),
    ).toHaveLength(0)
    expect(
      readFile.mock.calls.some(([path]) => path === '/workspace/.prettierrc'),
    ).toBe(false)
    files['/workspace/src/.prettierrc'] = '{"semi":true}'
    await handler({
      eventName: 'create',
      uri: 'file:///workspace/src/.prettierrc',
    })
    expect(
      await graph.load('/workspace/src/test.js', fs, 'file://', uri),
    ).toMatchObject({ request: { config: { semi: true } } })
    delete files['/workspace/src/.prettierrc']
    await handler({
      eventName: 'delete',
      uri: 'file:///workspace/src/.prettierrc',
    })
    expect(
      await graph.load('/workspace/src/test.js', fs, 'file://', uri),
    ).toMatchObject({ request: { config: { semi: false } } })
  } finally {
    await graph.dispose()
  }
})

test('concurrent formatting requests share in-flight discovery', async () => {
  const deferred = Promise.withResolvers<number>()
  const load = jest.fn(() => deferred.promise)
  const first = cache.get(uri, load)
  const second = cache.get(uri, load)
  while (load.mock.calls.length === 0) await Promise.resolve()
  deferred.resolve(1)
  expect(await Promise.all([first, second])).toEqual([1, 1])
  expect(load).toHaveBeenCalledTimes(1)
})
