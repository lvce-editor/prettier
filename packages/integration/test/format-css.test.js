import { testWorker } from '../src/testWorker.js'

test('format css', async () => {
  const execMap = {}
  const worker = await testWorker({
    execMap,
  })
  const uri = '/test/file.css'
  const content = ' h1 { height: 10px }'
  expect(await worker.execute('Format.format', uri, content)).toBe(`h1 {
  height: 10px;
}
`)
})
