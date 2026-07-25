import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.local-config-boolean'

export const test: Test = async ({
  Editor,
  expect,
  FileSystem,
  Locator,
  Main,
}) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const moduleRoot = `${tmpDir}/node_modules/prettier`
  await FileSystem.mkdir(moduleRoot)
  await FileSystem.writeFile(
    `${moduleRoot}/package.json`,
    JSON.stringify({
      exports: './index.js',
      name: 'prettier',
      type: 'module',
    }),
  )
  await FileSystem.writeFile(
    `${moduleRoot}/index.js`,
    `export const version = '3.7.0'
export const resolveConfig = async () => ({ semi: false })
export const format = async (content, options) => 'semi:' + options.semi`,
  )
  const uri = `${tmpDir}/test.js`
  await FileSystem.writeFile(uri, `let  x=1`)
  await Main.openUri(uri)

  await Editor.format()

  const editor = Locator('.Editor')
  await expect(editor).toHaveText('semi:false')
}
