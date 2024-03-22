import { testWorker } from '../src/testWorker.js'

test('format typescript', async () => {
  const execMap = {}
  const worker = await testWorker({
    execMap,
  })
  const uri = '/test/file.ts'
  const content = ` let x: string = ""`
  expect(await worker.execute('Prettier.format', uri, content)).toEqual({
    startOffset: 0,
    endOffset: 19,
    inserted: 'let x: string = "";\n',
  })
})
