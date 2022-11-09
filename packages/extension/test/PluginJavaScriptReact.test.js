import * as PluginJavaScriptReact from '../src/parts/PluginJavaScriptReact/PluginJavaScriptReact.js'
import * as Prettier from '../src/parts/Prettier/Prettier.js'
import * as PrettierModule from '../src/parts/PrettierModule/PrettierModule.js'

const plugins = await PrettierModule.loadAll(PluginJavaScriptReact.plugins)
const format = PluginJavaScriptReact.plugin(Prettier, plugins)

test('formatJavaScriptReact', () => {
  expect(format(' let x = ""')).toBe(`let x = "";
`)
})
