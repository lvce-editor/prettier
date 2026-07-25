import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.local-commonjs'

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
      main: './index.cjs',
      name: 'prettier',
    }),
  )
  await FileSystem.writeFile(
    `${tmpDir}/node_modules/prettier/index.cjs`,
    `module.exports = {
  version: '3.5.0',
  format: async () => 'formatted by local commonjs',
}`,
  )
  await FileSystem.writeFile(`${tmpDir}/test.js`, `let  x=1`)
  await Main.openUri(`${tmpDir}/test.js`)

  await Editor.format()

  const editor = Locator('.Editor')
  await expect(editor).toHaveText('formatted by local commonjs')
}
