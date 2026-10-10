import { expect, test } from '@jest/globals'
import { getDocumentContext } from '../src/parts/LocalPrettier/LocalPrettier.ts'

test('supports encoded paths and repeated separators in custom URI schemes', () => {
  const context = getDocumentContext(
    'remote-ssh://example/home/workspace//src/%23test.js',
  )

  expect(context).toMatchObject({
    cacheKeyNamespace: 'remote-ssh://example',
    filePath: '/home/workspace/src/#test.js',
  })
})

test('keeps custom filesystem authorities isolated', () => {
  const first = getDocumentContext('remote-ssh://one/workspace/test.js')
  const second = getDocumentContext('remote-ssh://two/workspace/test.js')

  expect(first?.cacheKeyNamespace).not.toBe(second?.cacheKeyNamespace)
})
