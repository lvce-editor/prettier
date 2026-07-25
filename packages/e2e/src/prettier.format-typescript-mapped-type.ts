import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-typescript-mapped-type'

const input = 'type Optional<T>={[Key in keyof T]?:T[Key]}'
const expected = 'type Optional<T> = { [Key in keyof T]?: T[Key] };\n'

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/test.ts`
  await FileSystem.writeFile(uri, input)
  await Main.openUri(uri)

  await Editor.format()

  await Editor.shouldHaveText(expected)
}
