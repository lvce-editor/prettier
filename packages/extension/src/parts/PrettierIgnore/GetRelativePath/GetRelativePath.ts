export const getRelativePath = (directory: string, file: string): string => {
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
