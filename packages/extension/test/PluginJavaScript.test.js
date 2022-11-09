import * as PluginJavaScript from '../src/parts/PluginJavaScript/PluginJavaScript.js'
import * as Prettier from '../src/parts/Prettier/Prettier.js'
import * as PrettierModule from '../src/parts/PrettierModule/PrettierModule.js'

const plugins = await PrettierModule.loadAll(PluginJavaScript.plugins)
const formatJavaScript = PluginJavaScript.plugin(Prettier, plugins)

test('formatJavaScript', () => {
  expect(formatJavaScript(' let x = ""')).toBe(`let x = "";
`)
})
