import { testWorker } from '../src/testWorker.js'
import { test, expect } from '@jest/globals'

test('format yaml', async () => {
  const execMap = {}
  const worker = await testWorker({
    execMap,
  })
  const uri = '/test/file.yml'
  const content = '- x: 1'
  expect(await worker.execute('Prettier.format', uri, content)).toEqual({
    startOffset: 6,
    endOffset: 6,
    inserted: `\n`,
  })
})
