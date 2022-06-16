import * as PluginTypeScriptReact from '../src/parts/PluginTypeScriptReact/PluginTypeScriptReact.js'
import * as Prettier from '../src/parts/Prettier/Prettier.js'

const formatTypeScriptReact =
  PluginTypeScriptReact.plugin(Prettier)

test('formatTypeScriptReact', () => {
  expect(formatTypeScriptReact(' let x: string = ""')).toBe(`let x: string = "";
`)
})
