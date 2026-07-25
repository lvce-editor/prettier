import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-javascript-switch-statement'

const input = `const label=(value)=>{switch(value){case 1:return'one';case 2:return'two';default:return'other'}}`
const expected = `const label = (value) => {
  switch (value) {
    case 1:
      return "one";
    case 2:
      return "two";
    default:
      return "other";
  }
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
