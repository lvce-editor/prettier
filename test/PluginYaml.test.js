import * as PluginYaml from '../src/parts/PluginYaml/PluginYaml.js'
import * as Prettier from '../src/parts/Prettier/Prettier.js'

const formatYaml = PluginYaml.plugin(Prettier)

test('formatYaml', () => {
  expect(formatYaml('- x: 1')).toBe(`- x: 1
`)
})
