import { expect, test } from '@jest/globals'
import * as PrettierConfig from '../src/parts/PrettierConfig/PrettierConfig.ts'

test('parse package json config', () => {
  expect(
    PrettierConfig.parsePackageJsonConfig(`{
      "name": "test",
      "prettier": {
        "semi": false,
        "singleQuote": true
      }
    }`),
  ).toEqual({
    semi: false,
    singleQuote: true,
  })
})

test('parse package json without prettier config', () => {
  expect(
    PrettierConfig.parsePackageJsonConfig(`{
      "name": "test"
    }`),
  ).toBeUndefined()
})

test('parse prettierrc config', () => {
  expect(
    PrettierConfig.parsePrettierrcConfig(`{
      "semi": false,
      "singleQuote": true
    }`),
  ).toEqual({
    semi: false,
    singleQuote: true,
  })
})

test('parse prettier config js esm', () => {
  expect(
    PrettierConfig.parsePrettierConfigJs(`export default {
      semi: false,
      singleQuote: true,
    }`),
  ).toEqual({
    semi: false,
    singleQuote: true,
  })
})

test('parse prettier config js commonjs', () => {
  expect(
    PrettierConfig.parsePrettierConfigJs(`module.exports = {
      semi: false,
      singleQuote: true,
    }`),
  ).toEqual({
    semi: false,
    singleQuote: true,
  })
})

test('reject unsupported prettier config js', () => {
  expect(() => {
    PrettierConfig.parsePrettierConfigJs(`export default getConfig()`)
  }).toThrow(
    'Unsupported prettier.config.js: expected a static object export',
  )
})
