export const getAncestorDirectories = (
  directory: string,
): readonly string[] => {
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
