import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-markdown-reference-link'

const input = `Read the [guide][docs] and visit [example][site].

[docs]:https://example.com/docs "Guide"
[site]: https://example.com`
const expected = `Read the [guide][docs] and visit [example][site].

[docs]: https://example.com/docs "Guide"
[site]: https://example.com
`

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/test.md`
  await FileSystem.writeFile(uri, input)
  await Main.openUri(uri)

  await Editor.format()

  await Editor.shouldHaveText(expected)
}
