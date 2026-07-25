import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.local-nearest-invalid-shadows-parent'

export const test: Test = async ({
  Editor,
  expect,
  FileSystem,
  Locator,
  Main,
}) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const packageJson = JSON.stringify({
    exports: './index.js',
    name: 'prettier',
    type: 'module',
  })
  const rootModule = `${tmpDir}/node_modules/prettier`
  await FileSystem.mkdir(rootModule)
  await FileSystem.writeFile(`${rootModule}/package.json`, packageJson)
  await FileSystem.writeFile(
    `${rootModule}/index.js`,
    `export const version = '3.7.0'
export const format = async () => 'parent prettier'`,
  )
  const nearestModule = `${tmpDir}/packages/app/node_modules/prettier`
  await FileSystem.mkdir(nearestModule)
  await FileSystem.writeFile(`${nearestModule}/package.json`, packageJson)
  await FileSystem.writeFile(
    `${nearestModule}/index.js`,
    `export const version = '3.7.0'`,
  )
  const uri = `${tmpDir}/packages/app/src/test.js`
  await FileSystem.mkdir(`${tmpDir}/packages/app/src`)
  await FileSystem.writeFile(uri, `let  x=1`)
  await Main.openUri(uri)

  await Editor.format()

  const editor = Locator('.Editor')
  await expect(editor).toHaveText('let x = 1;')
}
