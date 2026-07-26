/* eslint-disable @typescript-eslint/no-implied-eval */

interface NodeModule {
  readonly dependencies: Readonly<Record<string, string>>
  readonly id: string
  readonly source: string
}

export interface NodeModuleGraph {
  readonly entries: Readonly<Record<string, string>>
  readonly modules: readonly NodeModule[]
}

const dirname = (path: string): string => {
  const index = path.lastIndexOf('/')
  return index <= 0 ? '/' : path.slice(0, index)
}

export const evaluate = (
  graph: NodeModuleGraph,
): Readonly<Record<string, unknown>> => {
  const modules = new Map(graph.modules.map((module) => [module.id, module]))
  const cache = new Map<string, { exports: any }>()
  const load = (id: string): any => {
    const cached = cache.get(id)
    if (cached) {
      return cached.exports
    }
    const definition = modules.get(id)
    if (!definition) {
      throw new Error(`Module ${id} is missing from the graph`)
    }
    const module = {
      exports: {},
    }
    cache.set(id, module)
    const require = (specifier: string): unknown => {
      const dependency = definition.dependencies[specifier]
      if (!dependency) {
        throw new Error(
          `Module ${specifier} is not declared as a dependency of ${id}`,
        )
      }
      return load(dependency)
    }
    // eslint-disable-next-line sonarjs/code-eval -- Code execution is the purpose of this CSP-restricted worker.
    const execute = new Function(
      'module',
      'exports',
      'require',
      '__filename',
      '__dirname',
      'process',
      'Buffer',
      'fetch',
      'XMLHttpRequest',
      'WebSocket',
      'EventSource',
      `${definition.source}\n//# sourceURL=${encodeURI(id)}`,
    )
    // eslint-disable-next-line sonarjs/code-eval -- The wrapper receives only declared graph dependencies.
    execute(
      module,
      module.exports,
      require,
      id,
      dirname(id),
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    )
    return module.exports
  }
  const entries: Record<string, unknown> = Object.create(null)
  for (const [name, id] of Object.entries(graph.entries)) {
    entries[name] = load(id)
  }
  return entries
}
