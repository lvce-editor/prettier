import * as MinimizeEdit from '../src/parts/MinimizeEdit/MinimizeEdit.js'

test('minimizeEdit - insert one character', () => {
  const a = 'abce'
  const b = 'abcde'
  expect(MinimizeEdit.minimizeEdit(a, b)).toEqual({
    startOffset: 3,
    endOffset: 4,
    inserted: 'd',
  })
})

test('minimizeEdit - delete one character', () => {
  const a = 'abcde'
  const b = 'abce'
  expect(MinimizeEdit.minimizeEdit(a, b)).toEqual({
    startOffset: 3,
    endOffset: 4,
    inserted: '',
  })
})
