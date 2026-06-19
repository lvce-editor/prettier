import { test, expect } from '@jest/globals'
import { testWorker } from '../src/testWorker.js'

test('format markdown', async () => {
  const execMap = {}
  const worker = await testWorker({
    execMap,
  })
  const uri = '/test/file.md'
  const content = '# test'
  expect(await worker.execute('Prettier.format', uri, content)).toEqual({
    endOffset: 6,
    inserted: `\n`,
    startOffset: 6,
  })
})
