import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-typescript-satisfies'

const input =
  "const routes={home:'/',settings:'/settings'}satisfies Record<string,string>"
const expected = `const routes = { home: "/", settings: "/settings" } satisfies Record<
  string,
  string
>;
`

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/test.ts`
  await FileSystem.writeFile(uri, input)
  await Main.openUri(uri)

  await Editor.format()

  await Editor.shouldHaveText(expected)
}
