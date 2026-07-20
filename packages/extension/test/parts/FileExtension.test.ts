import { expect, test } from '@jest/globals'
import * as FileExtension from '../../src/parts/FileExtension/FileExtension.ts'

test('exports supported file extension constants', () => {
  expect(FileExtension.Css).toBe('.css')
  expect(FileExtension.GraphQl).toBe('.gql')
  expect(FileExtension.Html).toBe('.html')
  expect(FileExtension.JavascriptModule).toBe('.mjs')
  expect(FileExtension.JavaScript).toBe('.js')
  expect(FileExtension.Jsx).toBe('.jsx')
  expect(FileExtension.Json).toBe('.json')
  expect(FileExtension.Jsonc).toBe('.jsonc')
  expect(FileExtension.Less).toBe('.less')
  expect(FileExtension.Markdown).toBe('.md')
  expect(FileExtension.Scss).toBe('.scss')
  expect(FileExtension.Typescript).toBe('.ts')
  expect(FileExtension.Tsx).toBe('.tsx')
  expect(FileExtension.Yaml).toBe('.yml')
  expect(FileExtension.Vue).toBe('.vue')
})
