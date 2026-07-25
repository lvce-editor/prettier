import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.local-nearest-package'

export const test: Test = async ({
  Editor,
  expect,
  FileSystem,
  Locator,
  Main,
}) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const rootPackage = JSON.stringify({
    exports: './index.js',
    name: 'prettier',
    type: 'module',
  })
  await FileSystem.mkdir(`${tmpDir}/node_modules/prettier`)
  await FileSystem.writeFile(
    `${tmpDir}/node_modules/prettier/package.json`,
    rootPackage,
  )
  await FileSystem.writeFile(
    `${tmpDir}/node_modules/prettier/index.js`,
    `export const version = '3.6.0'
export const format = async () => 'root local prettier'`,
  )
  await FileSystem.mkdir(`${tmpDir}/packages/app/node_modules/prettier`)
  await FileSystem.writeFile(
    `${tmpDir}/packages/app/node_modules/prettier/package.json`,
    rootPackage,
  )
  await FileSystem.writeFile(
    `${tmpDir}/packages/app/node_modules/prettier/index.js`,
    `export const version = '3.6.0'
export const format = async () => 'nearest local prettier'`,
  )
  await FileSystem.mkdir(`${tmpDir}/packages/app/src`)
  await FileSystem.writeFile(`${tmpDir}/packages/app/src/test.js`, `let  x=1`)
  await Main.openUri(`${tmpDir}/packages/app/src/test.js`)

  await Editor.format()

  const editor = Locator('.Editor')
  await expect(editor).toHaveText('nearest local prettier')
}
