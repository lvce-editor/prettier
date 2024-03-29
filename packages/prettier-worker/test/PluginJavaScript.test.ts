import { expect, test } from '@jest/globals'
import * as PluginJavaScript from '../src/parts/PluginJavaScript/PluginJavaScript.ts'
import * as Prettier from '../src/parts/Prettier/Prettier.ts'
import * as PrettierModule from '../src/parts/PrettierModule/PrettierModule.ts'

const plugins = await PrettierModule.loadAll(PluginJavaScript.plugins)
const format = (code) => {
  return Prettier.format(code, {
    plugins,
    parser: PluginJavaScript.parser,
  })
}

test('formatJavaScript', async () => {
  expect(await format(' let x = ""')).toBe(`let x = "";
`)
})
