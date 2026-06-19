export const trimTrailingSlash = (path: string): string => {
  if (path === '/') {
    return path
  }
  return path.replace(/\/+$/, '')
}
