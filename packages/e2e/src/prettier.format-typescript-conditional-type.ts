import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-typescript-conditional-type'

const input = 'type ElementType<T>=T extends readonly(infer Item)[]?Item:T'
const expected =
  'type ElementType<T> = T extends readonly (infer Item)[] ? Item : T;\n'

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/test.ts`
  await FileSystem.writeFile(uri, input)
  await Main.openUri(uri)

  await Editor.format()

  await Editor.shouldHaveText(expected)
}
