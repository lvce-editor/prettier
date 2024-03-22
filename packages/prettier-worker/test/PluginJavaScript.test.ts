import * as PluginJavaScript from '../src/parts/PluginJavaScript/PluginJavaScript.js'
import * as Prettier from '../src/parts/Prettier/Prettier.js'
import * as PrettierModule from '../src/parts/PrettierModule/PrettierModule.js'

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
