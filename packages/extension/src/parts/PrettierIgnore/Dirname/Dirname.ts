import { trimTrailingSlash } from '../TrimTrailingSlash/TrimTrailingSlash.ts'

export const dirname = (path: string): string => {
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
