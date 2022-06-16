import * as PluginJson from '../src/parts/PluginJson/PluginJson.js'
import * as Prettier from '../src/parts/Prettier/Prettier.js'

const formatJson = PluginJson.plugin(Prettier)

test('formatJson', () => {
  expect(formatJson(' {}')).toBe(`{}
`)
})
