import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-javascript-arrow-function'

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/test.js`,
    'const  double=(value)=>value*2',
  )
  await Main.openUri(`${tmpDir}/test.js`)

  // act
  await Editor.format()

  // assert
  await Editor.shouldHaveText('const double = (value) => value * 2;\n')
}
