import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-javascript-long-call'

const input =
  'const result=calculate(firstArgument,secondArgument,thirdArgument,fourthArgument,fifthArgument,sixthArgument)'
const expected = `const result = calculate(
  firstArgument,
  secondArgument,
  thirdArgument,
  fourthArgument,
  fifthArgument,
  sixthArgument,
);
`

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/test.js`
  await FileSystem.writeFile(uri, input)
  await Main.openUri(uri)

  await Editor.format()

  await Editor.shouldHaveText(expected)
}
