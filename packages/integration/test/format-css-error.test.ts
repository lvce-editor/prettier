import { testWorker } from '../src/testWorker.js'
import { test, expect } from '@jest/globals'

test('format css', async () => {
  const execMap = {}
  const worker = await testWorker({
    execMap,
  })
  const uri = '/test/file.css'
  const content = ' h1 {'
  await expect(worker.execute('Prettier.format', uri, content)).rejects.toThrow(
    new Error(`Failed to format /test/file.css: SyntaxError: CssSyntaxError: Unclosed block (1:2)
> 1 |  h1 {
    |  ^`),
  )
})
