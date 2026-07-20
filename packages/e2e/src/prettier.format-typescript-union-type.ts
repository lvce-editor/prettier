import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-typescript-union-type'

const input = 'type Result<T>={ok:true;value:T}|{ok:false;error:Error}'
const expected =
  'type Result<T> = { ok: true; value: T } | { ok: false; error: Error };\n'

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.ts`, input)
  await Main.openUri(`${tmpDir}/test.ts`)

  // act
  await Editor.format()

  // assert
  await Editor.shouldHaveText(expected)
}
