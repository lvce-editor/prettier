import { testWorker } from '../src/testWorker.js'
import { test, expect } from '@jest/globals'

test('format json', async () => {
  const execMap = {}
  const worker = await testWorker({
    execMap,
  })
  const uri = '/test/file.json'
  const content = '{}'
  expect(await worker.execute('Prettier.format', uri, content)).toEqual({
    startOffset: 2,
    endOffset: 2,
    inserted: `\n`,
  })
})
