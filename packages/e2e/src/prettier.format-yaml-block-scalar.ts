import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-yaml-block-scalar'

const input = `message: |
 hello
 world
items:
 - one
 - two`
const expected = `message: |
  hello
  world
items:
  - one
  - two
`

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/test.yml`
  await FileSystem.writeFile(uri, input)
  await Main.openUri(uri)

  await Editor.format()

  await Editor.shouldHaveText(expected)
}
