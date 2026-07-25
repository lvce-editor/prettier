import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-markdown-task-list'

const input = `# Tasks
- [x]done
- [ ]todo
  - [ ]nested`
const expected = `# Tasks

- [x]done
- [ ]todo
  - [ ]nested
`

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/test.md`
  await FileSystem.writeFile(uri, input)
  await Main.openUri(uri)

  await Editor.format()

  await Editor.shouldHaveText(expected)
}
