import { testWorker } from '../src/testWorker.js'

test('format json', async () => {
  const execMap = {}
  const worker = await testWorker({
    execMap,
  })
  const uri = '/test/file.json'
  const content = '{}'
  expect(await worker.execute('Prettier.format', uri, content)).toEqual({
    startOffset: 1,
    endOffset: 2,
    inserted: `\n`,
  })
})
