import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'

interface Prettier {
  readonly format: (
    content: string,
    options: Readonly<Record<string, unknown>>,
  ) => Promise<string> | string
  readonly resolveConfig?: (
    filePath: string,
    options?: Readonly<Record<string, unknown>>,
  ) => Promise<Readonly<Record<string, unknown>> | null>
  readonly resolveConfigFile?: (filePath: string) => Promise<string | null>
  readonly version: string
}

export interface FormattedResult {
  readonly formattedText: string
  readonly path: string
  readonly status: 'formatted'
  readonly version: string
}

export interface FormatErrorResult {
  readonly message: string
  readonly status: 'format-error'
}

export interface UnavailableResult {
  readonly reason: string
  readonly status: 'unavailable'
}

export type FormatResult =
  | FormattedResult
  | FormatErrorResult
  | UnavailableResult

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

const loadModule = async (path: string): Promise<unknown> => {
  return import(pathToFileURL(path).href)
}

const resolvePlugins = async (
  plugins: unknown,
  require: NodeJS.Require,
): Promise<readonly unknown[]> => {
  if (!Array.isArray(plugins)) {
    return []
  }
  return Promise.all(
    plugins.map(async (plugin) => {
      if (typeof plugin !== 'string') {
        return plugin
      }
      return unwrapDefault(await loadModule(require.resolve(plugin)))
    }),
  )
}

const toErrorMessage = (error: unknown): string => {
  return error instanceof Error ? error.message : String(error)
}

export const format = async (
  filePath: string,
  content: string,
): Promise<FormatResult> => {
  const require = createRequire(filePath)
  let prettierPath: string
  try {
    prettierPath = require.resolve('prettier')
  } catch {
    return {
      reason: 'not found',
      status: 'unavailable',
    }
  }
  try {
    const prettier = getPrettier(await loadModule(prettierPath))
    if (!prettier) {
      return {
        reason: `Invalid Prettier module at ${prettierPath}`,
        status: 'unavailable',
      }
    }
    const config =
      (await prettier.resolveConfig?.(filePath, {
        useCache: false,
      })) ?? {}
    const configPath = await prettier.resolveConfigFile?.(filePath)
    const pluginRequire = configPath ? createRequire(configPath) : require
    const plugins = await resolvePlugins(config.plugins, pluginRequire)
    const formattedText = await prettier.format(content, {
      ...config,
      filepath: filePath,
      plugins,
    })
    if (typeof formattedText !== 'string') {
      return {
        message: `Local Prettier ${prettier.version} returned a non-string result`,
        status: 'format-error',
      }
    }
    return {
      formattedText,
      path: prettierPath,
      status: 'formatted',
      version: prettier.version,
    }
  } catch (error) {
    return {
      message: `Local Prettier failed: ${toErrorMessage(error)}`,
      status: 'format-error',
    }
  }
}
