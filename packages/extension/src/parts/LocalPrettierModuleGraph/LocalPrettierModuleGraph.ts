import { exists, readFile } from '@lvce-editor/api'
import * as NodeModuleGraph from '../NodeModuleGraph/NodeModuleGraph.ts'
import * as PluginModule from '../PluginModule/PluginModule.ts'
import * as PrettierModuleId from '../PrettierModuleId/PrettierModuleId.ts'

// cspell:ignore meriyah

interface LocalPrettierLoadRequest {
  readonly cacheKey: string
  readonly config: unknown
  readonly configEntry: string
  readonly graph: NodeModuleGraph.NodeModuleGraph
  readonly parser: string | undefined
  readonly path: string
  readonly pluginEntries: readonly string[]
  readonly prettierEntry: string
}

type LocalPrettierLoadResult =
  | {
      readonly request: LocalPrettierLoadRequest
      readonly status: 'available'
    }
  | {
      readonly reason: string
      readonly status: 'unavailable'
    }

interface ResolvedConfig {
  readonly entry: string
  readonly path: string
  readonly value: unknown
}

const pluginNames: Readonly<Record<number, string>> = {
  [PrettierModuleId.PluginAcorn]: 'acorn',
  [PrettierModuleId.PluginAcornAndEspree]: 'acorn',
  [PrettierModuleId.PluginAngular]: 'angular',
  [PrettierModuleId.PluginBabel]: 'babel',
  [PrettierModuleId.PluginEstree]: 'estree',
  [PrettierModuleId.PluginFlow]: 'flow',
  [PrettierModuleId.PluginGlimmer]: 'glimmer',
  [PrettierModuleId.PluginGraphql]: 'graphql',
  [PrettierModuleId.PluginHtml]: 'html',
  [PrettierModuleId.PluginMarkdown]: 'markdown',
  [PrettierModuleId.PluginMeriyah]: 'meriyah',
  [PrettierModuleId.PluginPostCss]: 'postcss',
  [PrettierModuleId.PluginTypeScript]: 'typescript',
  [PrettierModuleId.PluginYaml]: 'yaml',
}

const configFileNames = [
  'prettier.config.js',
  'prettier.config.cjs',
  'prettier.config.mjs',
  'prettier.config.ts',
  'prettier.config.cts',
  'prettier.config.mts',
  '.prettierrc.js',
  '.prettierrc.cjs',
  '.prettierrc.mjs',
  '.prettierrc.ts',
  '.prettierrc.cts',
  '.prettierrc.mts',
  '.prettierrc',
  '.prettierrc.json',
]

const dirname = (path: string): string => {
  let normalized = path.replaceAll('\\', '/')
  while (normalized.endsWith('/') && normalized.length > 1) {
    normalized = normalized.slice(0, -1)
  }
  const index = normalized.lastIndexOf('/')
  if (index <= 0) {
    return /^[A-Za-z]:$/.test(normalized) ? normalized : '/'
  }
  return normalized.slice(0, index)
}

const join = (directory: string, name: string): string => {
  return directory === '/' ? `/${name}` : `${directory}/${name}`
}

const isJsonConfig = (path: string): boolean => {
  return path.endsWith('.json') || path.endsWith('/.prettierrc')
}

const findConfigFile = async (
  directory: string,
  fileSystem: NodeModuleGraph.FileSystem,
): Promise<ResolvedConfig | undefined> => {
  for (const fileName of configFileNames) {
    const path = join(directory, fileName)
    if (await fileSystem.exists(path)) {
      const json = isJsonConfig(path)
      return {
        entry: json ? '' : path,
        path,
        value: json ? JSON.parse(await fileSystem.readFile(path)) : undefined,
      }
    }
  }
  return undefined
}

const findPackageJsonConfig = async (
  directory: string,
  fileSystem: NodeModuleGraph.FileSystem,
): Promise<ResolvedConfig | undefined> => {
  const packageJsonPath = join(directory, 'package.json')
  if (!(await fileSystem.exists(packageJsonPath))) {
    return undefined
  }
  const packageJson = JSON.parse(
    await fileSystem.readFile(packageJsonPath),
  ) as Readonly<Record<string, unknown>>
  if (!('prettier' in packageJson)) {
    return undefined
  }
  return {
    entry: '',
    path: packageJsonPath,
    value: packageJson.prettier,
  }
}

const findConfig = async (
  filePath: string,
  fileSystem: NodeModuleGraph.FileSystem,
): Promise<ResolvedConfig> => {
  let directory = dirname(filePath)
  while (true) {
    const config =
      (await findConfigFile(directory, fileSystem)) ||
      (await findPackageJsonConfig(directory, fileSystem))
    if (config) {
      return config
    }
    const parent = dirname(directory)
    if (parent === directory || directory === '/') {
      return {
        entry: '',
        path: '',
        value: undefined,
      }
    }
    directory = parent
  }
}

const toFileUri = (path: string): string => {
  const url = new URL('file:///')
  url.pathname = /^[A-Za-z]:\//.test(path) ? `/${path}` : path
  return url.href
}

const defaultFileSystem: NodeModuleGraph.FileSystem = {
  exists: (path: string): Promise<boolean> => exists(toFileUri(path)),
  readFile: (path: string): Promise<string> => readFile(toFileUri(path)),
}

const resolvePrettierEntry = async (
  packageRoot: string,
  fileSystem: NodeModuleGraph.FileSystem,
): Promise<string> => {
  const standalone = join(packageRoot, 'standalone.js')
  if (await fileSystem.exists(standalone)) {
    return standalone
  }
  return NodeModuleGraph.resolvePackageSubpath(packageRoot, '', fileSystem, [
    'browser',
    'require',
    'default',
    'import',
  ])
}

const resolvePluginEntry = async (
  packageRoot: string,
  pluginName: string,
  fileSystem: NodeModuleGraph.FileSystem,
): Promise<string | undefined> => {
  const candidates = [
    join(packageRoot, `plugins/${pluginName}.js`),
    join(packageRoot, `parser-${pluginName}.js`),
  ]
  for (const candidate of candidates) {
    if (await fileSystem.exists(candidate)) {
      return candidate
    }
  }
  try {
    return await NodeModuleGraph.resolvePackageSubpath(
      packageRoot,
      `plugins/${pluginName}`,
      fileSystem,
      ['browser', 'require', 'default', 'import'],
    )
  } catch {
    return undefined
  }
}

const getBundledPluginDefinition = (
  filePath: string,
): {
  readonly parser: string | undefined
  readonly plugins: readonly number[]
} => {
  try {
    return PluginModule.loadPlugin(filePath)
  } catch {
    return {
      parser: undefined,
      plugins: [],
    }
  }
}

const getConfiguredPluginSpecifiers = (config: unknown): readonly string[] => {
  if (!config || typeof config !== 'object' || !('plugins' in config)) {
    return []
  }
  const { plugins } = config as Readonly<Record<string, unknown>>
  if (!Array.isArray(plugins)) {
    return []
  }
  return plugins.filter(
    (plugin): plugin is string => typeof plugin === 'string',
  )
}

export const load = async (
  filePath: string,
  fileSystem: NodeModuleGraph.FileSystem = defaultFileSystem,
): Promise<LocalPrettierLoadResult> => {
  const packageRoot = await NodeModuleGraph.findPackageRoot(
    'prettier',
    dirname(filePath),
    fileSystem,
  )
  if (!packageRoot) {
    return {
      reason: 'not found',
      status: 'unavailable',
    }
  }
  try {
    const prettierEntry = await resolvePrettierEntry(packageRoot, fileSystem)
    const config = await findConfig(filePath, fileSystem)
    const { parser, plugins } = getBundledPluginDefinition(filePath)
    const pluginEntries: string[] = []
    for (const specifier of getConfiguredPluginSpecifiers(config.value)) {
      pluginEntries.push(
        await NodeModuleGraph.resolveModule(
          specifier,
          config.path || filePath,
          fileSystem,
        ),
      )
    }
    for (const pluginId of plugins) {
      const pluginName = pluginNames[pluginId]
      if (!pluginName) {
        continue
      }
      const pluginEntry = await resolvePluginEntry(
        packageRoot,
        pluginName,
        fileSystem,
      )
      if (pluginEntry) {
        pluginEntries.push(pluginEntry)
      }
    }
    const entries: Record<string, string> = {
      prettier: prettierEntry,
    }
    for (const [index, pluginEntry] of pluginEntries.entries()) {
      entries[`plugin:${index}`] = pluginEntry
    }
    if (config.entry) {
      entries.config = config.entry
    }
    const graph = await NodeModuleGraph.build(entries, fileSystem)
    return {
      request: {
        cacheKey: `${packageRoot}\0${config.path}\0${pluginEntries.join('\0')}`,
        config: config.value,
        configEntry: config.entry ? 'config' : '',
        graph,
        parser,
        path: prettierEntry,
        pluginEntries: pluginEntries.map((_, index) => `plugin:${index}`),
        prettierEntry: 'prettier',
      },
      status: 'available',
    }
  } catch (error) {
    return {
      reason: error instanceof Error ? error.message : String(error),
      status: 'unavailable',
    }
  }
}
