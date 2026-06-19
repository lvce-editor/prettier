export const name = 'prettier.format-benchmark-large-file'

const createUnformattedLine = (index) => {
  return `const item${index}={foo:${index},bar:[${index},${index + 1}]};`
}

const createFormattedLine = (index) => {
  return `const item${index} = { foo: ${index}, bar: [${index}, ${index + 1}] };`
}

const createText = (createLine) => {
  return Array.from({ length: 100 }, (_, index) => createLine(index)).join('\n')
}

export const test = async ({ Editor, FileSystem, Main }) => {
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
