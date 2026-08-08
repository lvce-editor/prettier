/* eslint-disable sonarjs/cognitive-complexity */
import { packages, transform } from '@babel/standalone'

export interface FileSystem {
  readonly exists: (uri: string) => Promise<boolean>
  readonly readFile: (uri: string) => Promise<string>
}

export interface NodeModule {
  readonly dependencies: Readonly<Record<string, string>>
  readonly id: string
  readonly source: string
}

export interface NodeModuleGraph {
  readonly entries: Readonly<Record<string, string>>
  readonly modules: readonly NodeModule[]
}

interface PackageJson {
  readonly browser?: unknown
  readonly exports?: unknown
  readonly main?: unknown
  readonly module?: unknown
}

const builtInModulePattern =
  /^(?:node:|assert$|buffer$|child_process$|crypto$|events$|fs$|http$|https$|module$|net$|os$|path$|process$|stream$|tls$|url$|util$|worker_threads$|zlib$)/
const scriptExtensions = ['.js', '.cjs', '.mjs', '.json', '.ts', '.cts', '.mts']

const dirname = (path: string): string => {
  const index = path.lastIndexOf('/')
  if (index <= 0) {
    return '/'
  }
  return path.slice(0, index)
}

const join = (directory: string, name: string): string => {
  return directory === '/' ? `/${name}` : `${directory}/${name}`
}

const normalizePath = (path: string): string => {
  const prefix = path.startsWith('/') ? '/' : ''
  const parts: string[] = []
  for (const part of path.replaceAll('\\', '/').split('/')) {
    if (!part || part === '.') {
      continue
    }
    if (part === '..') {
      parts.pop()
      continue
    }
    parts.push(part)
  }
  return `${prefix}${parts.join('/')}` || '/'
}

const isObject = (
  value: unknown,
): value is Readonly<Record<string, unknown>> => {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value))
}

const readPackageJson = async (
  packageRoot: string,
  fileSystem: FileSystem,
): Promise<PackageJson> => {
  const content = await fileSystem.readFile(join(packageRoot, 'package.json'))
  return JSON.parse(content) as PackageJson
}

const resolveConditionalTarget = (
  value: unknown,
  conditions: readonly string[],
): string | undefined => {
  if (typeof value === 'string') {
    return value
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const resolved = resolveConditionalTarget(item, conditions)
      if (resolved) {
        return resolved
      }
    }
    return undefined
  }
  if (!isObject(value)) {
    return undefined
  }
  for (const condition of conditions) {
    const resolved = resolveConditionalTarget(value[condition], conditions)
    if (resolved) {
      return resolved
    }
  }
  return undefined
}

const resolveAsFile = async (
  path: string,
  fileSystem: FileSystem,
): Promise<string | undefined> => {
  if (await fileSystem.exists(path)) {
    try {
      await fileSystem.readFile(path)
      return path
    } catch {
      // The path can be a directory. Continue with file candidates.
    }
  }
  for (const extension of scriptExtensions) {
    const candidate = `${path}${extension}`
    if (await fileSystem.exists(candidate)) {
      return candidate
    }
  }
  return undefined
}

const resolveAsDirectory = async (
  path: string,
  fileSystem: FileSystem,
  conditions: readonly string[],
): Promise<string | undefined> => {
  const packageJsonPath = join(path, 'package.json')
  if (await fileSystem.exists(packageJsonPath)) {
    const packageJson = await readPackageJson(path, fileSystem)
    const target =
      resolveConditionalTarget(packageJson.exports, conditions) ||
      (typeof packageJson.browser === 'string'
        ? packageJson.browser
        : undefined) ||
      (typeof packageJson.module === 'string'
        ? packageJson.module
        : undefined) ||
      (typeof packageJson.main === 'string' ? packageJson.main : undefined)
    if (target) {
      const resolved = await resolveAsPath(
        normalizePath(join(path, target)),
        fileSystem,
        conditions,
      )
      if (resolved) {
        return resolved
      }
    }
  }
  return resolveAsFile(join(path, 'index'), fileSystem)
}

const resolveAsPath = async (
  path: string,
  fileSystem: FileSystem,
  conditions: readonly string[],
): Promise<string | undefined> => {
  return (
    (await resolveAsFile(path, fileSystem)) ||
    (await resolveAsDirectory(path, fileSystem, conditions))
  )
}

const splitPackageSpecifier = (
  specifier: string,
): { readonly packageName: string; readonly subpath: string } => {
  const parts = specifier.split('/')
  if (specifier.startsWith('@')) {
    return {
      packageName: parts.slice(0, 2).join('/'),
      subpath: parts.slice(2).join('/'),
    }
  }
  return {
    packageName: parts[0],
    subpath: parts.slice(1).join('/'),
  }
}

export const findPackageRoot = async (
  packageName: string,
  startDirectory: string,
  fileSystem: FileSystem,
): Promise<string | undefined> => {
  let directory = normalizePath(startDirectory)
  while (true) {
    const packageRoot = join(join(directory, 'node_modules'), packageName)
    if (await fileSystem.exists(join(packageRoot, 'package.json'))) {
      return packageRoot
    }
    const parent = dirname(directory)
    if (parent === directory || directory === '/') {
      return undefined
    }
    directory = parent
  }
}

export const resolvePackageSubpath = async (
  packageRoot: string,
  subpath: string,
  fileSystem: FileSystem,
  conditions: readonly string[] = ['browser', 'import', 'require', 'default'],
): Promise<string> => {
  const packageJson = await readPackageJson(packageRoot, fileSystem)
  const exportKey = subpath ? `./${subpath}` : '.'
  let exportValue: unknown
  if (isObject(packageJson.exports) && exportKey in packageJson.exports) {
    exportValue = packageJson.exports[exportKey]
  } else if (!subpath) {
    exportValue = packageJson.exports
  }
  const target = resolveConditionalTarget(exportValue, conditions)
  if (target) {
    const resolved = await resolveAsPath(
      normalizePath(join(packageRoot, target)),
      fileSystem,
      conditions,
    )
    if (resolved) {
      return resolved
    }
  }
  let resolved: string | undefined
  if (subpath) {
    resolved = await resolveAsPath(
      join(packageRoot, subpath),
      fileSystem,
      conditions,
    )
  } else {
    const standalone = await resolveAsFile(
      join(packageRoot, 'standalone'),
      fileSystem,
    )
    if (standalone) {
      return standalone
    }
    const fallback =
      (typeof packageJson.browser === 'string'
        ? packageJson.browser
        : undefined) ||
      (typeof packageJson.module === 'string'
        ? packageJson.module
        : undefined) ||
      (typeof packageJson.main === 'string' ? packageJson.main : undefined) ||
      'index'
    resolved = await resolveAsPath(
      normalizePath(join(packageRoot, fallback)),
      fileSystem,
      conditions,
    )
  }
  if (resolved) {
    return resolved
  }
  throw new Error(
    `Cannot resolve package subpath ${exportKey} in ${packageRoot}`,
  )
}

export const resolveModule = async (
  specifier: string,
  importer: string,
  fileSystem: FileSystem,
): Promise<string> => {
  if (
    builtInModulePattern.test(specifier) ||
    /^[A-Za-z][A-Za-z\d+.-]*:/.test(specifier)
  ) {
    throw new Error(`Module ${specifier} is not available in the sandbox`)
  }
  if (specifier.startsWith('.') || specifier.startsWith('/')) {
    const path = normalizePath(
      specifier.startsWith('/')
        ? specifier
        : join(dirname(importer), specifier),
    )
    const resolved = await resolveAsPath(path, fileSystem, [
      'browser',
      'import',
      'require',
      'default',
    ])
    if (resolved) {
      return resolved
    }
    throw new Error(`Cannot resolve ${specifier} from ${importer}`)
  }
  const { packageName, subpath } = splitPackageSpecifier(specifier)
  const packageRoot = await findPackageRoot(
    packageName,
    dirname(importer),
    fileSystem,
  )
  if (!packageRoot) {
    throw new Error(`Cannot find package ${packageName} from ${importer}`)
  }
  return resolvePackageSubpath(packageRoot, subpath, fileSystem)
}

interface TransformedModule {
  readonly dependencies: readonly string[]
  readonly source: string
}

const getTransformedModule = (
  source: string,
  filename: string,
): TransformedModule => {
  if (filename.endsWith('.json')) {
    JSON.parse(source)
    return {
      dependencies: [],
      source: `module.exports = ${source}`,
    }
  }
  const isTypeScript = /\.(?:cts|mts|ts)$/.test(filename)
  const parserPlugins = isTypeScript
    ? ['typescript']
    : ['jsx', 'importAttributes']
  const ast = packages.parser.parse(source, {
    allowAwaitOutsideFunction: true,
    plugins: parserPlugins as any,
    sourceType: 'unambiguous',
  })
  const dependencies = new Set<string>()
  let requiresTransform = isTypeScript
  const seen = new WeakSet<object>()
  const visit = (value: unknown): void => {
    if (!value || typeof value !== 'object' || seen.has(value)) {
      return
    }
    seen.add(value)
    const node = value as Record<string, any>
    if (
      [
        'ExportAllDeclaration',
        'ExportDefaultDeclaration',
        'ExportNamedDeclaration',
        'ImportDeclaration',
      ].includes(node.type)
    ) {
      if (typeof node.source?.value === 'string') {
        dependencies.add(node.source.value)
      }
      requiresTransform = true
    }
    if (node.type === 'CallExpression' && node.callee?.type === 'Import') {
      requiresTransform = true
    }
    if (node.type === 'ImportExpression') {
      requiresTransform = true
      if (typeof node.source?.value === 'string') {
        dependencies.add(node.source.value)
      }
    }
    if (
      node.type === 'CallExpression' &&
      node.arguments?.length === 1 &&
      typeof node.arguments[0]?.value === 'string' &&
      ((node.callee?.type === 'Identifier' && node.callee.name === 'require') ||
        node.callee?.type === 'Import')
    ) {
      dependencies.add(node.arguments[0].value)
    }
    for (const child of Object.values(node)) {
      if (Array.isArray(child)) {
        for (const item of child) {
          visit(item)
        }
      } else {
        visit(child)
      }
    }
  }
  visit(ast)
  if (!requiresTransform) {
    return {
      dependencies: [...dependencies],
      source,
    }
  }
  const plugins: any[] = [
    'transform-modules-commonjs',
    'transform-dynamic-import',
  ]
  if (isTypeScript) {
    plugins.unshift([
      'transform-typescript',
      {
        allowDeclareFields: true,
      },
    ])
  }
  const result = transform(source, {
    filename,
    parserOpts: {
      allowAwaitOutsideFunction: true,
      plugins: parserPlugins as any,
    },
    plugins,
    sourceType: 'unambiguous',
  })
  if (typeof result.code !== 'string') {
    throw new TypeError(`Failed to transform ${filename}`)
  }
  return {
    dependencies: [...dependencies],
    source: result.code,
  }
}

export const build = async (
  entries: Readonly<Record<string, string>>,
  fileSystem: FileSystem,
): Promise<NodeModuleGraph> => {
  const modules = new Map<string, NodeModule>()
  const load = async (id: string): Promise<void> => {
    if (modules.has(id)) {
      return
    }
    const transformed = getTransformedModule(await fileSystem.readFile(id), id)
    const dependencies: Record<string, string> = Object.create(null)
    modules.set(id, {
      dependencies,
      id,
      source: transformed.source,
    })
    for (const specifier of transformed.dependencies) {
      const resolved = await resolveModule(specifier, id, fileSystem)
      dependencies[specifier] = resolved
      await load(resolved)
    }
  }
  for (const id of Object.values(entries)) {
    await load(id)
  }
  const moduleValues: NodeModule[] = []
  modules.forEach((module) => {
    moduleValues.push(module)
  })
  return {
    entries,
    modules: moduleValues,
  }
}
