import { testWorker } from '../src/testWorker.js'

test('format javascript', async () => {
  const execMap = {}
  const worker = await testWorker({
    execMap,
  })
  const uri = '/test/file.js'
  const content = `let x=1`
  expect(await worker.execute('Format.format', uri, content)).toBe('2.39.2')
})
