import * as PrettierConfigFileSystem from '../PrettierConfigFileSystem/PrettierConfigFileSystem.ts'

export type PrettierConfig = Record<string, unknown>

const ConfigFileNames = ['package.json', '.prettierrc', 'prettier.config.js']

const isObject = (value: unknown): value is PrettierConfig => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const ensureConfigObject = (
  value: unknown,
  configFile: string,
): PrettierConfig | undefined => {
  if (value === undefined || value === null) {
    return undefined
  }
  if (!isObject(value)) {
    throw new TypeError(
      `Config is only allowed to be an object, but received ${typeof value} in "${configFile}"`,
    )
  }
  const { $schema, ...config } = value
  return config
}

export const parsePackageJsonConfig = (
  content: string,
  configFile = 'package.json',
): PrettierConfig | undefined => {
  const parsed = JSON.parse(content)
  return ensureConfigObject(parsed.prettier, configFile)
}

export const parsePrettierrcConfig = (
  content: string,
  configFile = '.prettierrc',
): PrettierConfig => {
  const parsed = JSON.parse(content)
  const config = ensureConfigObject(parsed, configFile)
  if (!config) {
    throw new TypeError(`Config is only allowed to be an object in "${configFile}"`)
  }
  return config
}

const findObjectEnd = (content: string, start: number): number => {
  let depth = 0
  let quote = ''
  let escaped = false
  for (let i = start; i < content.length; i++) {
    const char = content[i]
    if (quote) {
      if (escaped) {
        escaped = false
      } else if (char === '\\') {
        escaped = true
      } else if (char === quote) {
        quote = ''
      }
      continue
    }
    if (char === '"' || char === "'") {
      quote = char
      continue
    }
    if (char === '{') {
      depth++
    } else if (char === '}') {
      depth--
      if (depth === 0) {
        return i
      }
    }
  }
  return -1
}

const extractStaticObject = (content: string, configFile: string): string => {
  const patterns = [/export\s+default\s*/g, /module\s*\.\s*exports\s*=\s*/g]
  for (const pattern of patterns) {
    const match = pattern.exec(content)
    if (!match) {
      continue
    }
    const start = match.index + match[0].length
    const nextNonWhitespace = content.slice(start).search(/\S/)
    if (nextNonWhitespace === -1) {
      break
    }
    const trimmedStart = start + nextNonWhitespace
    if (content[trimmedStart] !== '{') {
      break
    }
    const end = findObjectEnd(content, trimmedStart)
    if (end === -1) {
      break
    }
    const rest = content.slice(end + 1).trim()
    if (rest && rest !== ';') {
      break
    }
    return content.slice(trimmedStart, end + 1)
  }
  throw new Error(
    `Unsupported ${configFile}: expected a static object export`,
  )
}

const removeTrailingCommas = (content: string): string => {
  return content.replace(/,\s*([}\]])/g, '$1')
}

const quoteObjectKeys = (content: string): string => {
  return content.replace(
    /([{,]\s*)([A-Za-z_$][\w$]*)(\s*:)/g,
    '$1"$2"$3',
  )
}

const quoteSingleQuotedStrings = (content: string): string => {
  return content.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, (_match, value) => {
    return JSON.stringify(value.replace(/\\'/g, "'"))
  })
}

export const parsePrettierConfigJs = (
  content: string,
  configFile = 'prettier.config.js',
): PrettierConfig => {
  const objectText = extractStaticObject(content, configFile)
  const jsonText = removeTrailingCommas(
    quoteSingleQuotedStrings(quoteObjectKeys(objectText)),
  )
  const parsed = JSON.parse(jsonText)
  const config = ensureConfigObject(parsed, configFile)
  if (!config) {
    throw new TypeError(`Config is only allowed to be an object in "${configFile}"`)
  }
  return config
}

const joinPath = (directory: string, name: string): string => {
  if (directory.endsWith('/')) {
    return `${directory}${name}`
  }
  return `${directory}/${name}`
}

const dirname = (uri: string): string => {
  const index = uri.lastIndexOf('/')
  if (index <= 0) {
    return '/'
  }
  return uri.slice(0, index)
}

const parentDir = (directory: string): string => {
  if (directory === '/') {
    return '/'
  }
  return dirname(directory)
}

const parseConfig = (
  name: string,
  content: string,
  configFile: string,
): PrettierConfig | undefined => {
  switch (name) {
    case 'package.json':
      return parsePackageJsonConfig(content, configFile)
    case '.prettierrc':
      return parsePrettierrcConfig(content, configFile)
    case 'prettier.config.js':
      return parsePrettierConfigJs(content, configFile)
    default:
      return undefined
  }
}

export const resolveConfig = async (
  uri: string,
): Promise<PrettierConfig | undefined> => {
  let directory = dirname(uri)
  while (true) {
    for (const name of ConfigFileNames) {
      const configFile = joinPath(directory, name)
      if (!(await PrettierConfigFileSystem.exists(configFile))) {
        continue
      }
      const content = await PrettierConfigFileSystem.readFile(configFile)
      const config = parseConfig(name, content, configFile)
      if (config) {
        return config
      }
    }
    const parent = parentDir(directory)
    if (parent === directory) {
      return undefined
    }
    directory = parent
  }
}
