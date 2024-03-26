import { expect, test } from '@jest/globals'
import * as PluginGraphql from '../src/parts/PluginGraphql/PluginGraphql.ts'
import * as Prettier from '../src/parts/Prettier/Prettier.ts'
import * as PrettierModule from '../src/parts/PrettierModule/PrettierModule.ts'

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
