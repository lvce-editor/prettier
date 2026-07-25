import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-typescript-type-import'

const input = `import{type Request,type Response,createServer}from'node:http'
export type{Request,Response}`
const expected = `import { type Request, type Response, createServer } from "node:http";
export type { Request, Response };
`

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/test.ts`
  await FileSystem.writeFile(uri, input)
  await Main.openUri(uri)

  await Editor.format()

  await Editor.shouldHaveText(expected)
}
