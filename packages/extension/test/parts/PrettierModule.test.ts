import { expect, test } from '@jest/globals'
import * as PrettierModule from '../../src/parts/PrettierModule/PrettierModule.ts'
import * as PrettierModuleId from '../../src/parts/PrettierModuleId/PrettierModuleId.ts'

test('load throws for unknown module id', async () => {
  await expect(PrettierModule.load(-1)).rejects.toThrow('module -1 not found')
})

test('load unwraps default exports', async () => {
  const standalone = await PrettierModule.load(PrettierModuleId.Standalone)

  expect(standalone).toHaveProperty('format')
  expect(standalone).toHaveProperty('formatWithCursor')
})

test('loadAll loads all requested modules in order', async () => {
  const [standalone] = await PrettierModule.loadAll([
    PrettierModuleId.Standalone,
  ])

  expect(standalone).toHaveProperty('format')
})
