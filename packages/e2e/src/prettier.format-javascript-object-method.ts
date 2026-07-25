import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-javascript-object-method'

const input =
  'const counter={value:0,increment(amount=1){this.value+=amount;return this.value}}'
const expected = `const counter = {
  value: 0,
  increment(amount = 1) {
    this.value += amount;
    return this.value;
  },
};
`

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/test.js`
  await FileSystem.writeFile(uri, input)
  await Main.openUri(uri)

  await Editor.format()

  await Editor.shouldHaveText(expected)
}
