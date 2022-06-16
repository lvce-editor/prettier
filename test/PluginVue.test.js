import * as PluginVue from '../src/parts/PluginVue/PluginVue.js'
import * as Prettier from '../src/parts/Prettier/Prettier.js'

const formatVue = PluginVue.plugin(Prettier)

test('formatVue', () => {
  expect(formatVue(' <template>hello world</template>'))
    .toBe(`<template>hello world</template>
`)
})
