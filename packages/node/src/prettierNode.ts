import { createRequire } from 'node:module'
import { dirname, isAbsolute, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

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
  readonly path: string
  readonly prettier: Prettier
}

interface FormattedResult {
  readonly formattedText: string
  readonly path: string
  readonly status: 'formatted'
  readonly version: string
}

interface UnavailableResult {
  readonly reason: string
  readonly status: 'unavailable'
}

interface FormatErrorResult {
  readonly message: string
  readonly status: 'format-error'
}

type FormatResult = FormattedResult | UnavailableResult | FormatErrorResult

const minimumSupportedMajorVersion = 2
const protocolPattern = /^[A-Za-z][A-Za-z\d+.-]*:/

const toErrorMessage = (error: unknown): string => {
  return error instanceof Error ? error.message : String(error)
}

const toFilePath = (uri: string): string | undefined => {
  if (uri.startsWith('file:')) {
    return fileURLToPath(uri)
  }
  if (protocolPattern.test(uri)) {
    return undefined
  }
  return isAbsolute(uri) ? uri : resolve(uri)
}

const getPrettier = (module: unknown): Prettier | undefined => {
  if (!module || typeof module !== 'object') {
    return undefined
  }
  const namespace = module as Record<string, unknown>
  const candidate =
    typeof namespace.format === 'function' ? namespace : namespace.default
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

const loadPrettier = async (
  filePath: string,
): Promise<LoadedPrettier | UnavailableResult> => {
  let modulePath: string
  try {
    const resolverPath = join(dirname(filePath), '.lvce-prettier-resolver.cjs')
    modulePath = createRequire(resolverPath).resolve('prettier')
  } catch (error) {
    return {
      reason: `not found: ${toErrorMessage(error)}`,
      status: 'unavailable',
    }
  }

  let module: unknown
  try {
    module = await import(pathToFileURL(modulePath).href)
  } catch (error) {
    return {
      reason: `failed to load ${modulePath}: ${toErrorMessage(error)}`,
      status: 'unavailable',
    }
  }

  const prettier = getPrettier(module)
  if (!prettier) {
    return {
      reason: `invalid Prettier module at ${modulePath}`,
      status: 'unavailable',
    }
  }
  if (!isSupportedVersion(prettier.version)) {
    return {
      reason: `unsupported Prettier version ${prettier.version}`,
      status: 'unavailable',
    }
  }
  return {
    path: modulePath,
    prettier,
  }
}

export const formatLocal = async (
  uri: string,
  content: string,
): Promise<FormatResult> => {
  const filePath = toFilePath(uri)
  if (!filePath) {
    return {
      reason: `unsupported document URI ${uri}`,
      status: 'unavailable',
    }
  }
  const loaded = await loadPrettier(filePath)
  if ('status' in loaded) {
    return loaded
  }
  const { path, prettier } = loaded
  try {
    const config = (await prettier.resolveConfig?.(filePath)) || {}
    const formattedText = await prettier.format(content, {
      ...config,
      filepath: filePath,
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

export const commandMap = {
  'LocalPrettier.format': formatLocal,
}
