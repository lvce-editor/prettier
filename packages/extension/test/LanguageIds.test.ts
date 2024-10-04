import { expect, test } from '@jest/globals'
import * as LanguageIds from '../src/parts/LanguageIds/LanguageIds.ts'

test('css', () => {
  expect(LanguageIds.languageIds).toContain('css')
})

test('html', () => {
  expect(LanguageIds.languageIds).toContain('html')
})

test('json', () => {
  expect(LanguageIds.languageIds).toContain('json')
})

test('javascript', () => {
  expect(LanguageIds.languageIds).toContain('javascript')
})

test('typescript', () => {
  expect(LanguageIds.languageIds).toContain('typescript')
})

test('graphql', () => {
  expect(LanguageIds.languageIds).toContain('graphql')
})
