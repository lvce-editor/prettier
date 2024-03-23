import { readFileSync, writeFileSync } from 'node:fs'

export const replace = ({ path, occurrence, replacement }) => {
  const oldContent = readFileSync(path, 'utf8')
  const newContent = oldContent.replace(occurrence, replacement)
  writeFileSync(path, newContent)
}
