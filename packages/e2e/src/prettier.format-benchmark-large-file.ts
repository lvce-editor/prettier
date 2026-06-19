import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-benchmark-large-file'

const createUnformattedLine = (index: number): string => {
  return `const item${index}={foo:${index},bar:[${index},${index + 1}]};`
}

const createFormattedLine = (index: number): string => {
  return `const item${index} = { foo: ${index}, bar: [${index}, ${index + 1}] };`
}

const createText = (createLine: (index: number) => string): string => {
  return Array.from({ length: 100 }, (_, index) => createLine(index)).join('\n')
}

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const input = createText(createUnformattedLine)
  const expected = `${createText(createFormattedLine)}\n`
  await FileSystem.writeFile(`${tmpDir}/test.js`, input)
  await Main.openUri(`${tmpDir}/test.js`)

  // act
  await Editor.format()

  // assert
  await Editor.shouldHaveText(expected)
}
