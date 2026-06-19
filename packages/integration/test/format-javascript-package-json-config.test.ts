import { testWorker } from '../src/testWorker.js'
import { test, expect } from '@jest/globals'

test('format javascript with package json prettier config', async () => {
  const files = {
    '/test/package.json': JSON.stringify({
      prettier: {
        semi: false,
        singleQuote: true,
      },
    }),
  }
  const execMap = {
    'FileSystem.exists'(uri) {
      return uri in files
    },
    'FileSystem.readFile'(uri) {
      return files[uri]
    },
  }
  const worker = await testWorker({
    execMap,
  })
  const uri = '/test/file.js'
  const content = `let message="hello";`
  expect(await worker.execute('Prettier.format', uri, content)).toEqual({
    startOffset: 11,
    endOffset: 20,
    inserted: ` = 'hello'\n`,
  })
})
