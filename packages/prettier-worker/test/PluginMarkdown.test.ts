import * as PluginMarkdown from '../src/parts/PluginMarkdown/PluginMarkdown.js'
import * as Prettier from '../src/parts/Prettier/Prettier.js'
import * as PrettierModule from '../src/parts/PrettierModule/PrettierModule.js'

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
`)
  ).toBe(`\`\`\`html
  <h1>hello world</h1>
\`\`\`
`)
})
