import * as PluginVue from '../src/parts/PluginVue/PluginVue.ts'
import * as Prettier from '../src/parts/Prettier/Prettier.ts'
import * as PrettierModule from '../src/parts/PrettierModule/PrettierModule.ts'
import { test, expect } from '@jest/globals'

const plugins = await PrettierModule.loadAll(PluginVue.plugins)
const format = (code) => {
  return Prettier.format(code, {
    plugins,
    parser: PluginVue.parser,
  })
}

test('formatVue', async () => {
  expect(await format(' <template>hello world</template>'))
    .toBe(`<template>hello world</template>
`)
})
