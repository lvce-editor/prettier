import { expect, test } from '@jest/globals'
import * as MinimizeEdit from '../../src/parts/MinimizeEdit/MinimizeEdit.ts'

test('returns an empty edit for equal strings', () => {
  expect(MinimizeEdit.minimizeEdit('abc', 'abc')).toEqual({
    endOffset: 3,
    inserted: '',
    startOffset: 3,
  })
})

test('minimizes a replacement in the middle', () => {
  expect(MinimizeEdit.minimizeEdit('hello world', 'hello brave world')).toEqual(
    {
      endOffset: 6,
      inserted: 'brave ',
      startOffset: 6,
    },
  )
})

test('minimizes deletion', () => {
  expect(MinimizeEdit.minimizeEdit('hello brave world', 'hello world')).toEqual(
    {
      endOffset: 12,
      inserted: '',
      startOffset: 6,
    },
  )
})

test('minimizes full replacement', () => {
  expect(MinimizeEdit.minimizeEdit('abc', 'xyz')).toEqual({
    endOffset: 3,
    inserted: 'xyz',
    startOffset: 0,
  })
})
