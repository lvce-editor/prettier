import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.local-version-2'

export const test: Test = async ({
  Editor,
  expect,
  FileSystem,
  Locator,
  Main,
}) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await FileSystem.mkdir(`${tmpDir}/node_modules/prettier`)
  await FileSystem.writeFile(
    `${tmpDir}/node_modules/prettier/package.json`,
    JSON.stringify({
      exports: './index.js',
      name: 'prettier',
      type: 'module',
    }),
  )
  await FileSystem.writeFile(
    `${tmpDir}/node_modules/prettier/index.js`,
    `export const version = '2.8.8'
export const format = () => 'formatted by local prettier 2'`,
  )
  await FileSystem.writeFile(`${tmpDir}/test.js`, `let  x=1`)
  await Main.openUri(`${tmpDir}/test.js`)

  await Editor.format()

  const editor = Locator('.Editor')
  await expect(editor).toHaveText('formatted by local prettier 2')
}
