import fs from 'node:fs'
import { join } from 'node:path'

export const copyPrettier = (root, outDir) => {
  const source = join(root, 'node_modules', 'prettier')
  const target = join(outDir, 'third_party', 'prettier')
  fs.rmSync(target, { recursive: true, force: true })
  fs.mkdirSync(join(target, 'plugins'), {
    recursive: true,
  })
  for (const file of [
    'standalone.mjs',
    'README.md',
    'LICENSE',
    'package.json',
  ]) {
    fs.cpSync(join(source, file), join(target, file), {
      recursive: true,
    })
  }
  const dirents = fs.readdirSync(join(source, 'plugins'))
  for (const dirent of dirents) {
    if (dirent.endsWith('.mjs')) {
      fs.cpSync(
        join(source, 'plugins', dirent),
        join(target, 'plugins', dirent),
      )
    }
  }
}
