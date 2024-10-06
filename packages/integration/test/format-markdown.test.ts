import { testWorker } from '../src/testWorker.js'
import { test, expect } from '@jest/globals'

test('format markdown', async () => {
  const execMap = {}
  const worker = await testWorker({
    execMap,
  })
  const uri = '/test/file.md'
  const content = '# test'
  expect(await worker.execute('Prettier.format', uri, content)).toEqual({
    startOffset: 1,
    endOffset: 36,
    inserted: ` # test`,
  })
})
