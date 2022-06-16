import * as PluginJavaScript from '../src/parts/PluginJavaScript/PluginJavaScript.js'
import * as Prettier from '../src/parts/Prettier/Prettier.js'

const formatJavaScript = PluginJavaScript.plugin(Prettier)

test('formatJavaScript', () => {
  expect(formatJavaScript(' let x = ""')).toBe(`let x = "";
`)
})
