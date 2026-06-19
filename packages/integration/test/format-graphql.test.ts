import { test, expect } from '@jest/globals'
import { testWorker } from '../src/testWorker.js'

test('format graphql', async () => {
  const execMap = {}
  const worker = await testWorker({
    execMap,
  })
  const uri = '/test/file.gql'
  const content = '{ human(id: "1000") {name height}  }'
  expect(await worker.execute('Prettier.format', uri, content)).toEqual({
    endOffset: 36,
    inserted: `
  human(id: \"1000\") {
    name
    height
  }
}
`,
    startOffset: 1,
  })
})
