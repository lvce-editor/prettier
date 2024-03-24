import { testWorker } from '../src/testWorker.js'
import { test, expect } from '@jest/globals'

test('format typescript react', async () => {
  const execMap = {}
  const worker = await testWorker({
    execMap,
  })
  const uri = '/test/file.tsx'
  const content = ` let x: string = ""`
  expect(await worker.execute('Prettier.format', uri, content)).toEqual({
    startOffset: 0,
    endOffset: 19,
    inserted: 'let x: string = "";\n',
  })
})
