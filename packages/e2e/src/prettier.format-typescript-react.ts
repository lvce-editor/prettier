import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-typescript-react'

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/test.tsx`,
    'type Props={title:string};export const Card=({title}:Props)=><section><h1>{title}</h1></section>',
  )
  await Main.openUri(`${tmpDir}/test.tsx`)

  // act
  await Editor.format()

  // assert
  await Editor.shouldHaveText(`type Props = { title: string };
export const Card = ({ title }: Props) => (
  <section>
    <h1>{title}</h1>
  </section>
);
`)
}
