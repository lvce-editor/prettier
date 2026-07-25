import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-markdown-ordered-list'

const input = `1. first
2. second
     1. nested one
     2. nested two`
const expected = `1. first
2. second
   1. nested one
   2. nested two
`

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/test.md`
  await FileSystem.writeFile(uri, input)
  await Main.openUri(uri)

  await Editor.format()

  await Editor.shouldHaveText(expected)
}
