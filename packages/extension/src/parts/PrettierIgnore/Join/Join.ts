export const join = (directory: string, basename: string): string => {
  if (!directory) {
    return basename
  }
  if (directory === '/') {
    return `/${basename}`
  }
  return `${directory}/${basename}`
}
