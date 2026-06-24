import { expect, test } from '@jest/globals'
import * as PrettierParserId from '../../src/parts/PrettierParserId/PrettierParserId.ts'

test('exports stable prettier parser ids', () => {
  expect(PrettierParserId.Angular).toBe('angular')
  expect(PrettierParserId.Babel).toBe('babel')
  expect(PrettierParserId.Css).toBe('css')
  expect(PrettierParserId.GraphQl).toBe('graphql')
  expect(PrettierParserId.Html).toBe('html')
  expect(PrettierParserId.Json).toBe('json')
  expect(PrettierParserId.Less).toBe('less')
  expect(PrettierParserId.Markdown).toBe('markdown')
  expect(PrettierParserId.Scss).toBe('scss')
  expect(PrettierParserId.TypeScript).toBe('typescript')
  expect(PrettierParserId.Yaml).toBe('yaml')
})
