import * as MinimizeEdit from '../src/parts/MinimizeEdit/MinimizeEdit.js'

test('minimizeEdit - insert one character', () => {
  const a = 'abce'
  const b = 'abcde'
  expect(MinimizeEdit.minimizeEdit(a, b)).toEqual({
    startOffset: 3,
    endOffset: 3,
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

test('minimizeEdit - delete and add one character', () => {
  const a = 'abce'
  const b = 'abde'
  expect(MinimizeEdit.minimizeEdit(a, b)).toEqual({
    startOffset: 2,
    endOffset: 3,
    inserted: 'd',
  })
})

test('minimizeEdit - mixed edit', () => {
  const a = 'let  a=1;'
  const b = 'let a = 1;\n'
  expect(MinimizeEdit.minimizeEdit(a, b)).toEqual({
    startOffset: 4,
    endOffset: 9,
    inserted: 'a = 1;\n',
  })
})
