import { testWorker } from '../src/testWorker.js'

test('format css', async () => {
  const execMap = {}
  const worker = await testWorker({
    execMap,
  })
  const uri = '/test/file.css'
  const content = ' h1 { height: 10px }'
  expect(await worker.execute('Prettier.format', uri, content)).toEqual({
    startOffset: 0,
    endOffset: 20,
    inserted: `h1 {
  height: 10px;
}
`,
  })
})
