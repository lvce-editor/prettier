import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-typescript-enum'

const input =
  'enum Direction{Up="UP",Down="DOWN"}const direction:Direction=Direction.Up'
const expected = `enum Direction {
  Up = "UP",
  Down = "DOWN",
}
const direction: Direction = Direction.Up;
`

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
