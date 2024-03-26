import { expect, test } from '@jest/globals'
import * as PluginMarkdown from '../src/parts/PluginMarkdown/PluginMarkdown.ts'
import * as Prettier from '../src/parts/Prettier/Prettier.ts'
import * as PrettierModule from '../src/parts/PrettierModule/PrettierModule.ts'

const plugins = await PrettierModule.loadAll(PluginMarkdown.plugins)
const format = (code) => {
  return Prettier.format(code, {
    plugins,
    parser: PluginMarkdown.parser,
  })
}

test('formatMarkdown', async () => {
  expect(
    await format(`\`\`\`html
  <h1>hello world</h1>
\`\`\`
`),
  ).toBe(`\`\`\`html
  <h1>hello world</h1>
\`\`\`
`)
})
