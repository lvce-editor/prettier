import { testWorker } from '../src/testWorker.js'
import { test, expect } from '@jest/globals'

test('format javascript', async () => {
  const execMap = {}
  const worker = await testWorker({
    execMap,
  })
  const uri = '/test/file.js'
  const content = `let x=1`
  expect(await worker.execute('Prettier.format', uri, content)).toEqual({
    startOffset: 5,
    endOffset: 7,
    inserted: ' = 1;\n',
  })
})
