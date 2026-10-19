import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-prettierrc'

export const test: Test = async ({
  Editor,
  expect,
  FileSystem,
  Locator,
  Main,
}) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const moduleRoot = `${tmpDir}/node_modules/prettier`
  await FileSystem.mkdir(moduleRoot)
  await FileSystem.writeFile(
    `${moduleRoot}/package.json`,
    JSON.stringify({ main: './index.cjs', name: 'prettier' }),
  )
  await FileSystem.writeFile(
    `${moduleRoot}/index.cjs`,
    `module.exports = {
    version: '3.6.0',
    format(content, options) {
      const quote = options.singleQuote ? "'" : '\"'
      return 'let message = ' + quote + 'hello' + quote + (options.semi === false ? '' : ';')
    }
  }`,
  )
  await FileSystem.writeFile(
    `${tmpDir}/.prettierrc`,
    JSON.stringify({
      semi: false,
      singleQuote: true,
    }),
  )
  await FileSystem.writeFile(`${tmpDir}/test.js`, `let message="hello";`)
  await Main.openUri(`${tmpDir}/test.js`)

  // act
  await Editor.format()

  // assert
  const editor = Locator('.Editor')
  await expect(editor).toHaveText(`let message = 'hello'`)
  // Repeated small edits reuse discovery; a changed config must refresh the sandbox.
  await Editor.setText(`let message="hello";`)
  await Editor.format()
  await expect(editor).toHaveText(`let message = 'hello'`)
  await FileSystem.writeFile(
    `${tmpDir}/.prettierrc`,
    JSON.stringify({ semi: true, singleQuote: false }),
  )
  await Editor.setText(`let message="hello";`)
  await Editor.format()
  await expect(editor).toHaveText(`let message = "hello";`)
}
