import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.local-malformed-version'

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
    `export const version = 'latest'
export const format = async () => 'formatted by invalid prettier'`,
  )
  await FileSystem.writeFile(`${tmpDir}/test.js`, `let  x=1`)
  await Main.openUri(`${tmpDir}/test.js`)

  await Editor.format()

  const editor = Locator('.Editor')
  await expect(editor).toHaveText('let x = 1;')
}
