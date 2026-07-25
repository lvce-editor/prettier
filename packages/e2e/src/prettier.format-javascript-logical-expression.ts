import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-javascript-logical-expression'

const input =
  'const enabled=config&&config.feature&&config.feature.enabled||false'
const expected =
  'const enabled = (config && config.feature && config.feature.enabled) || false;\n'

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/test.js`
  await FileSystem.writeFile(uri, input)
  await Main.openUri(uri)

  await Editor.format()

  await Editor.shouldHaveText(expected)
}
