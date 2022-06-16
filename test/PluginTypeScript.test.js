import * as PluginTypeScript from '../src/parts/PluginTypeScript/PluginTypeScript.js'
import * as Prettier from '../src/parts/Prettier/Prettier.js'

const formatTypeScript = PluginTypeScript.plugin(Prettier)

test('formatTypeScript', () => {
  expect(formatTypeScript(' let x: string = ""')).toBe(`let x: string = "";
`)
})
