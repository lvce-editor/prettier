import { testWorker } from '../src/testWorker.js'

test('format angular', async () => {
  const execMap = {}
  const worker = await testWorker({
    execMap,
  })
  const uri = '/test/file.html'
  const content = ' <h1>hello world</h1>'
  expect(await worker.execute('Format.format', uri, content))
    .toBe(`<h1>hello world</h1>
  `)
})
