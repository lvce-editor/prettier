import * as PluginJsonc from '../src/parts/PluginJsonc/PluginJsonc.js'
import * as Prettier from '../src/parts/Prettier/Prettier.js'

const formatJsonc = PluginJsonc.plugin(Prettier)

test('formatJsonc', () => {
  expect(formatJsonc(' {}')).toBe(`{}
`)
})
