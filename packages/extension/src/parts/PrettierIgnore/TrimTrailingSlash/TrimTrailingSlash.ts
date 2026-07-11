export const trimTrailingSlash = (path: string): string => {
  let end = path.length
  while (end > 1 && path[end - 1] === '/') {
    end--
  }
  return path.slice(0, end)
}
