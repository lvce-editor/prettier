import { test, expect } from '@jest/globals'
import { testWorker } from '../src/testWorker.js'

test('format handlebars', async () => {
  const execMap = {}
  const worker = await testWorker({
    execMap,
  })
  const uri = '/test/file.hbs'
  const content = `<main>
{{#if user}}
<p>{{ user.name }}</p>
{{else}}
<p>Guest</p>
{{/if}}
</main>`
  expect(await worker.execute('Prettier.format', uri, content)).toEqual({
    endOffset: 80,
    inserted: `<main>
  {{#if user}}
    <p>{{user.name}}</p>
  {{else}}
    <p>Guest</p>
  {{/if}}
</main>
`,
    startOffset: 0,
  })
})
