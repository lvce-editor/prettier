import {
  createFileSystemWatcher,
  getPlatform,
  type FileSystemWatcher,
} from '@lvce-editor/api'

interface Entry<T> {
  disabled: boolean
  generation: number
  loading?: { readonly generation: number; readonly promise: Promise<T> }
  pending: Promise<void>
  value?: { readonly result: T }
  watcher?: FileSystemWatcher
}

interface Cache<T> {
  readonly dispose: () => Promise<void>
  readonly get: (uri: string | undefined, load: () => Promise<T>) => Promise<T>
}

// Bound resources when formatting documents from many unrelated folders.
const maximumEntries = 32

const closeWatcher = async (
  watcher: FileSystemWatcher | undefined,
): Promise<void> => {
  try {
    await watcher?.dispose()
  } catch {
    // Backend teardown failure must not prevent conservative formatting.
  }
}

const invalidate = <T>(entry: Entry<T>): void => {
  entry.generation++
  entry.value = undefined
  entry.loading = undefined
}

const disposeEntry = async <T>(entry: Entry<T>): Promise<void> => {
  entry.disabled = true
  invalidate(entry)
  await entry.pending
  await closeWatcher(entry.watcher)
}

const getRoots = (directory: string): readonly string[] => {
  const roots: string[] = []
  let root = directory
  while (true) {
    roots.push(root)
    const parent = new URL('..', root).href
    if (parent === root) return roots
    root = parent
  }
}

const startWatching = async <T>(
  entry: Entry<T>,
  directory: string,
  fileNames: readonly string[],
): Promise<void> => {
  const roots = getRoots(directory)
  const names = new Set(fileNames)
  // Observe ancestor replacement too: a watch on a removed directory cannot
  // safely cache lookups after that directory is recreated.
  const directoryNames = roots
    .map((root) =>
      decodeURIComponent(new URL(root).pathname.split('/').at(-2) || ''),
    )
    .filter((name) => name && !name.endsWith(':'))
  const childNames = [...new Set([...fileNames, ...directoryNames])]
  try {
    if ((await getPlatform()) === 'web') {
      entry.disabled = true
      return
    }
    entry.watcher = await createFileSystemWatcher(
      { childNames, recursive: false, roots },
      async (event) => {
        if (event.error || event.eventName === 'error') {
          entry.disabled = true
          invalidate(entry)
          await closeWatcher(entry.watcher)
          return
        }
        const url = new URL(event.uri)
        const name = decodeURIComponent(url.pathname.split('/').at(-1) || '')
        if (roots.includes(url.href.replace(/\/?$/, '/'))) {
          entry.disabled = true
          invalidate(entry)
          await closeWatcher(entry.watcher)
        } else if (names.has(name)) invalidate(entry)
      },
    )
    if (entry.disabled) await closeWatcher(entry.watcher)
  } catch {
    // Missing directories, web hosts and older backends cannot safely cache.
    entry.disabled = true
  }
}

const loadValue = async <T>(
  entry: Entry<T>,
  load: () => Promise<T>,
): Promise<T> => {
  await entry.pending
  if (entry.disabled) return load()
  if (entry.value) return entry.value.result
  for (let attempt = 0; attempt < 3; attempt++) {
    const { generation } = entry
    entry.loading ||= { generation, promise: load() }
    const { promise } = entry.loading
    let result: T
    try {
      result = await promise
    } catch (error) {
      if (entry.loading?.promise === promise) entry.loading = undefined
      throw error
    }
    if (entry.disabled) return load()
    if (entry.generation === generation) {
      entry.value = { result }
      entry.loading = undefined
      return result
    }
  }
  // Continuous config churn: keep the next request conservative as well.
  return load()
}

export const create = <T>(fileNames: readonly string[]): Cache<T> => {
  const entries = new Map<string, Entry<T>>()
  const dispose = async (): Promise<void> => {
    const previous = entries.values().toArray()
    entries.clear()
    await Promise.all(previous.map(disposeEntry))
  }
  const get = async (
    uri: string | undefined,
    load: () => Promise<T>,
  ): Promise<T> => {
    if (!uri?.startsWith('file://')) return load()
    const directory = new URL('.', uri).href
    let entry = entries.get(directory)
    if (!entry) {
      if (entries.size >= maximumEntries) {
        const oldest = entries.keys().next().value!
        const evicted = entries.get(oldest)!
        entries.delete(oldest)
        await disposeEntry(evicted)
      }
      entry = { disabled: false, generation: 0, pending: Promise.resolve() }
      entries.set(directory, entry)
      entry.pending = startWatching(entry, directory, fileNames)
    }
    return loadValue(entry, load)
  }
  return { dispose, get }
}
