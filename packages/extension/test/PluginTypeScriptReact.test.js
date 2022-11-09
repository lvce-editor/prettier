import * as PluginTypeScriptReact from '../src/parts/PluginTypeScriptReact/PluginTypeScriptReact.js'
import * as Prettier from '../src/parts/Prettier/Prettier.js'
import * as PrettierModule from '../src/parts/PrettierModule/PrettierModule.js'

const plugins = await PrettierModule.loadAll(PluginTypeScriptReact.plugins)
const format = PluginTypeScriptReact.plugin(Prettier, plugins)

test('formatTypeScriptReact', () => {
  expect(format(' let x: string = ""')).toBe(`let x: string = "";
`)
})
