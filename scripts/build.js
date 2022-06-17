import { execSync } from 'child_process'
import fs from 'fs'
import path, { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { packageExtension } from '@lvce-editor/package-extension'

const NOT_NEEDED = [
  'node_modules/prettier/bin-prettier.js',
  'node_modules/prettier/cli.js',
  'node_modules/prettier/doc.js',
  'node_modules/prettier/index.js',
  'node_modules/prettier/parser-angular.js',
  'node_modules/prettier/parser-babel.js',
  'node_modules/prettier/parser-espree.js',
  'node_modules/prettier/parser-flow.js',
  'node_modules/prettier/parser-glimmer.js',
  'node_modules/prettier/parser-graphql.js',
  'node_modules/prettier/parser-html.js',
  'node_modules/prettier/parser-markdown.js',
  'node_modules/prettier/parser-meriyah.js',
  'node_modules/prettier/parser-postcss.js',
  'node_modules/prettier/parser-typescript.js',
  'node_modules/prettier/parser-yaml.js',
  'node_modules/prettier/standalone.js',
  'node_modules/prettier/third-party.js',
]

const __dirname = dirname(fileURLToPath(import.meta.url))

const root = path.join(__dirname, '..')

fs.rmSync(join(root, 'dist'), { recursive: true, force: true })

fs.mkdirSync(path.join(root, 'dist'))

fs.copyFileSync(join(root, 'package.json'), join(root, 'dist', 'package.json'))
fs.copyFileSync(join(root, 'README.md'), join(root, 'dist', 'README.md'))
fs.copyFileSync(join(root, 'icon.png'), join(root, 'dist', 'icon.png'))
fs.copyFileSync(
  join(root, 'extension.json'),
  join(root, 'dist', 'extension.json')
)
fs.cpSync(join(root, 'src'), join(root, 'dist', 'src'), { recursive: true })

const getAllDependencies = (obj) => {
  if (!obj || !obj.dependencies) {
    return []
  }
  return [obj, ...Object.values(obj.dependencies).flatMap(getAllDependencies)]
}

const getDependencies = () => {
  const stdout = execSync('npm list --omit=dev --parseable --all', {
    cwd: root,
  }).toString()
  const lines = stdout.split('\n')
  return lines.slice(1, -1)
}

const dependencies = getDependencies()
for (const dependency of dependencies) {
  fs.cpSync(dependency, join(root, 'dist', dependency.slice(root.length)), {
    recursive: true,
  })
}

for (const notNeeded of NOT_NEEDED) {
  fs.rmSync(join(root, 'dist', notNeeded), { force: true })
}

await packageExtension({
  highestCompression: true,
  cwd: join(root, 'dist'),
})
