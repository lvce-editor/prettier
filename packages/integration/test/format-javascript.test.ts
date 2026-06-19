import { test, expect } from '@jest/globals'
import { testWorker } from '../src/testWorker.js'

test('format javascript', async () => {
  const execMap = {}
  const worker = await testWorker({
    execMap,
  })
  const uri = '/test/file.js'
  const content = `let x=1`
  expect(await worker.execute('Prettier.format', uri, content)).toEqual({
    endOffset: 7,
    inserted: ' = 1;\n',
    startOffset: 5,
  })
})
