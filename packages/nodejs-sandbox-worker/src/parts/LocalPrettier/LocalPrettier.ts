import {
  evaluate,
  type NodeModuleGraph,
} from '../EvaluateNodeModuleGraph/EvaluateNodeModuleGraph.ts'

export interface LocalPrettierLoadRequest {
  readonly cacheKey: string
  readonly config: unknown
  readonly configEntry: string
  readonly graph: NodeModuleGraph
  readonly parser: string | undefined
  readonly path: string
  readonly pluginEntries: readonly string[]
  readonly prettierEntry: string
}

interface Prettier {
  readonly format: (
    content: string,
    options: Readonly<Record<string, unknown>>,
  ) => Promise<string> | string
  readonly resolveConfig?: (
    filePath: string,
  ) => Promise<Readonly<Record<string, unknown>> | null>
  readonly version: string
}

interface LoadedPrettier {
  readonly config: unknown
  readonly path: string
  readonly plugins: readonly unknown[]
  readonly prettier: Prettier
}

const state = new Map<string, LoadedPrettier>()
const minimumSupportedMajorVersion = 2

const unwrapDefault = (value: unknown): unknown => {
  if (
    value &&
    (typeof value === 'object' || typeof value === 'function') &&
    'default' in value
  ) {
    return (value as Readonly<Record<string, unknown>>).default
  }
  return value
}

const getPrettier = (value: unknown): Prettier | undefined => {
  if (!value || typeof value !== 'object') {
    return undefined
  }
  const namespace = value as Readonly<Record<string, unknown>>
  const candidate =
    typeof namespace.format === 'function' ? namespace : unwrapDefault(value)
  if (!candidate || typeof candidate !== 'object') {
    return undefined
  }
  const prettier = candidate as Partial<Prettier>
  if (
    typeof prettier.format !== 'function' ||
    typeof prettier.version !== 'string'
  ) {
    return undefined
  }
  return prettier as Prettier
}

const isSupportedVersion = (version: string): boolean => {
  const match = /^(\d+)\./.exec(version)
  return Boolean(match && Number(match[1]) >= minimumSupportedMajorVersion)
}

export const loadLocalPrettier = (request: LocalPrettierLoadRequest): void => {
  if (state.has(request.cacheKey)) {
    return
  }
  const entries = evaluate(request.graph)
  const prettier = getPrettier(entries[request.prettierEntry])
  if (!prettier) {
    throw new Error(`Invalid Prettier module at ${request.path}`)
  }
  if (!isSupportedVersion(prettier.version)) {
    throw new Error(`Unsupported Prettier version ${prettier.version}`)
  }
  const config = request.configEntry
    ? unwrapDefault(entries[request.configEntry])
    : request.config
  const plugins = request.pluginEntries.map((entry) =>
    unwrapDefault(entries[entry]),
  )
  state.set(request.cacheKey, {
    config,
    path: request.path,
    plugins,
    prettier,
  })
}

const toErrorMessage = (error: unknown): string => {
  return error instanceof Error ? error.message : String(error)
}

export const formatWithLocalPrettier = async (
  cacheKey: string,
  filePath: string,
  content: string,
  parser: string | undefined,
): Promise<unknown> => {
  const loaded = state.get(cacheKey)
  if (!loaded) {
    return {
      reason: `Local Prettier ${cacheKey} has not been loaded`,
      status: 'unavailable',
    }
  }
  const { path, plugins, prettier } = loaded
  try {
    const resolvedConfig =
      loaded.config === undefined
        ? await prettier.resolveConfig?.(filePath)
        : loaded.config
    const config =
      resolvedConfig &&
      (typeof resolvedConfig === 'object' ||
        typeof resolvedConfig === 'function')
        ? resolvedConfig
        : {}
    const configuredPlugins =
      'plugins' in config && Array.isArray(config.plugins)
        ? config.plugins.filter((plugin) => typeof plugin !== 'string')
        : []
    const formattedText = await prettier.format(content, {
      ...(parser && { parser }),
      ...config,
      filepath: filePath,
      plugins: [...configuredPlugins, ...plugins],
    })
    if (typeof formattedText !== 'string') {
      return {
        message: `Local Prettier ${prettier.version} returned a non-string result`,
        status: 'format-error',
      }
    }
    return {
      formattedText,
      path,
      status: 'formatted',
      version: prettier.version,
    }
  } catch (error) {
    return {
      message: `Local Prettier ${prettier.version} failed: ${toErrorMessage(error)}`,
      status: 'format-error',
    }
  }
}

export const reset = (): void => {
  state.clear()
}
