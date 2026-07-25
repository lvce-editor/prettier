import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-json-object-collection'

const input =
  '{"users":{"ada":{"role":"admin","active":true},"grace":{"role":"editor","active":false}}}'
const expected = `{
  "users": {
    "ada": { "role": "admin", "active": true },
    "grace": { "role": "editor", "active": false }
  }
}
`

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/test.json`
  await FileSystem.writeFile(uri, input)
  await Main.openUri(uri)

  await Editor.format()

  await Editor.shouldHaveText(expected)
}
