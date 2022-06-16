import * as PluginJavaScriptReact from '../src/parts/PluginJavaScriptReact/PluginJavaScriptReact.js'
import * as Prettier from '../src/parts/Prettier/Prettier.js'

const formatJavaScriptReact =
  PluginJavaScriptReact.plugin(Prettier)

test('formatJavaScriptReact', () => {
  expect(formatJavaScriptReact(' let x = ""')).toBe(`let x = "";
`)
})
