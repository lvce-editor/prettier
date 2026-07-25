import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-json-primitive-array'

const input = '{"values":[true,false,null,1,"text"],"active":true}'
const expected =
  '{ "values": [true, false, null, 1, "text"], "active": true }\n'

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/test.json`
  await FileSystem.writeFile(uri, input)
  await Main.openUri(uri)

  await Editor.format()

  await Editor.shouldHaveText(expected)
}
