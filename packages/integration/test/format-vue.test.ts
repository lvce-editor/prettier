import { test, expect } from '@jest/globals'
import { testWorker } from '../src/testWorker.js'

test('format vue', async () => {
  const execMap = {}
  const worker = await testWorker({
    execMap,
  })
  const uri = '/test/file.vue'
  const content = ' <template>hello world</template>'
  expect(await worker.execute('Prettier.format', uri, content)).toEqual({
    endOffset: 33,
    inserted: `<template>hello world</template>\n`,
    startOffset: 0,
  })
})
