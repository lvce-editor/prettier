import { readFile } from '@lvce-editor/api'
import * as Ignore from 'ignore'

type ReadFile = (uri: string) => Promise<string>

const PrettierIgnoreFileName = '.prettierignore'
const createIgnore = Ignore.default

const normalizeUri = (uri: string): string => {
  if (uri.startsWith('file://')) {
    try {
      const url = new URL(uri)
      const pathName = decodeURIComponent(url.pathname)
      if (/^\/[a-zA-Z]:\//.test(pathName)) {
        return pathName.slice(1)
      }
      return pathName
    } catch {
      return uri
    }
  }
  return uri.replaceAll('\\', '/')
}

const trimTrailingSlash = (path: string): string => {
  if (path === '/') {
    return path
  }
  return path.replace(/\/+$/, '')
}

const dirname = (path: string): string => {
  const normalizedPath = trimTrailingSlash(path)
  const index = normalizedPath.lastIndexOf('/')
  if (index === -1) {
    return ''
  }
  if (index === 0) {
    return '/'
  }
  return normalizedPath.slice(0, index)
}

const getAncestorDirectories = (directory: string): readonly string[] => {
  if (!directory) {
    return ['']
  }
  const absolute = directory.startsWith('/')
  const parts = directory.split('/').filter(Boolean)
  if (absolute) {
    const directories = ['/']
    let current = ''
    for (const part of parts) {
      current += `/${part}`
      directories.push(current)
    }
    return directories
  }
  const directories: string[] = []
  let current = ''
  for (const part of parts) {
    current = current ? `${current}/${part}` : part
    directories.push(current)
  }
  return directories
}

const join = (directory: string, basename: string): string => {
  if (!directory) {
    return basename
  }
  if (directory === '/') {
    return `/${basename}`
  }
  return `${directory}/${basename}`
}

const getRelativePath = (directory: string, file: string): string => {
  if (!directory) {
    return file.replace(/^\/+/, '')
  }
  if (directory === '/') {
    return file.replace(/^\/+/, '')
  }
  if (file === directory) {
    return ''
  }
  if (file.startsWith(`${directory}/`)) {
    return file.slice(directory.length + 1)
  }
  return file.replace(/^\/+/, '')
}

const readIgnoreFile = async (
  readFileFn: ReadFile,
  uri: string,
): Promise<string> => {
  try {
    return await readFileFn(uri)
  } catch {
    return ''
  }
}

export const isIgnoredWithReadFile = async (
  uri: string,
  readFileFn: ReadFile,
): Promise<boolean> => {
  const file = normalizeUri(uri)
  const directories = getAncestorDirectories(dirname(file))
  let ignored = false
  for (const directory of directories) {
    const ignoreFileUri = join(directory, PrettierIgnoreFileName)
    const content = await readIgnoreFile(readFileFn, ignoreFileUri)
    if (!content) {
      continue
    }
    const relativePath = getRelativePath(directory, file)
    const result = createIgnore({ allowRelativePaths: true }).add(content).test(
      relativePath,
    )
    if (result.ignored) {
      ignored = true
    } else if (result.unignored) {
      ignored = false
    }
  }
  return ignored
}

export const isIgnored = (uri: string): Promise<boolean> => {
  return isIgnoredWithReadFile(uri, readFile)
}
