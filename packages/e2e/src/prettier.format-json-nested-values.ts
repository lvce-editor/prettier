import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-json-nested-values'

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/test.json`,
    '{"name":"app","scripts":{"test":"node test.js"},"keywords":["editor","format"]}',
  )
  await Main.openUri(`${tmpDir}/test.json`)

  // act
  await Editor.format()

  // assert
  await Editor.shouldHaveText(`{
  "name": "app",
  "scripts": { "test": "node test.js" },
  "keywords": ["editor", "format"]
}
`)
}
