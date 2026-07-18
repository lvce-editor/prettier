import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-javascript-class'

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/test.js`,
    'class Counter{constructor(){this.value=0}increment(){this.value++}}',
  )
  await Main.openUri(`${tmpDir}/test.js`)

  // act
  await Editor.format()

  // assert
  await Editor.shouldHaveText(`class Counter {
  constructor() {
    this.value = 0;
  }
  increment() {
    this.value++;
  }
}
`)
}
