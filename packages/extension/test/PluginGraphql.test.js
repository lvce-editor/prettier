import * as PluginGraphql from '../src/parts/PluginGraphql/PluginGraphql.js'
import * as Prettier from '../src/parts/Prettier/Prettier.js'
import * as PrettierModule from '../src/parts/PrettierModule/PrettierModule.js'

const plugins = await PrettierModule.loadAll(PluginGraphql.plugins)
const format = (code) => {
  return Prettier.format(code, {
    plugins,
    parser: PluginGraphql.parser,
  })
}

test('formatGraphql', async () => {
  expect(await format('{ human(id: "1000") {name height}  }')).toBe(`{
  human(id: "1000") {
    name
    height
  }
}
`)
})
