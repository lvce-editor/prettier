import { testWorker } from '../src/testWorker.js'
import { test, expect } from '@jest/globals'

test('format angular', async () => {
  const execMap = {}
  const worker = await testWorker({
    execMap,
  })
  const uri = '/test/file.html'
  const content = ' <h1>hello world</h1>'
  expect(await worker.execute('Prettier.format', uri, content)).toEqual({
    startOffset: 0,
    endOffset: 21,
    inserted: '<h1>hello world</h1>\n',
  })
})
