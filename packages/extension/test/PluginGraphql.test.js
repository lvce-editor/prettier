import * as PluginGraphql from '../src/parts/PluginGraphql/PluginGraphql.js'
import * as Prettier from '../src/parts/Prettier/Prettier.js'
import * as PrettierModule from '../src/parts/PrettierModule/PrettierModule.js'

const plugins = await PrettierModule.loadAll(PluginGraphql.plugins)
const format = PluginGraphql.plugin(Prettier, plugins)

test('formatGraphql', () => {
  expect(format('{ human(id: "1000") {name height}  }')).toBe(`{
  human(id: "1000") {
    name
    height
  }
}
`)
})
