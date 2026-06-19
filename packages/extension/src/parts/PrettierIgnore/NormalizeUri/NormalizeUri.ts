export const normalizeUri = (uri: string): string => {
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
