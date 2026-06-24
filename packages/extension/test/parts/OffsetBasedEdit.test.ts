import { expect, test } from '@jest/globals'
import type { OffsetBasedEdit } from '../../src/parts/OffsetBasedEdit/OffsetBasedEdit.ts'

test('describes an offset based text edit', () => {
  const edit: OffsetBasedEdit = {
    endOffset: 4,
    inserted: 'value',
    startOffset: 1,
  }

  expect(edit).toEqual({
    endOffset: 4,
    inserted: 'value',
    startOffset: 1,
  })
})
