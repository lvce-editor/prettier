import * as PluginVue from '../src/parts/PluginVue/PluginVue.js'
import * as Prettier from '../src/parts/Prettier/Prettier.js'
import * as PrettierModule from '../src/parts/PrettierModule/PrettierModule.js'

const plugins = await PrettierModule.loadAll(PluginVue.plugins)
const format = PluginVue.plugin(Prettier, plugins)

test('formatVue', () => {
  expect(format(' <template>hello world</template>'))
    .toBe(`<template>hello world</template>
`)
})
