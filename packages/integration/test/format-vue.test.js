import { testWorker } from '../src/testWorker.js'

test('format vue', async () => {
  const execMap = {}
  const worker = await testWorker({
    execMap,
  })
  const uri = '/test/file.vue'
  const content = ' <template>hello world</template>'
  expect(await worker.execute('Prettier.format', uri, content)).toEqual({
    startOffset: 0,
    endOffset: 33,
    inserted: `<template>hello world</template>\n`,
  })
})
