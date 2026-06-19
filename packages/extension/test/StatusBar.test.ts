import { expect, test } from '@jest/globals'
import * as StatusBar from '../src/parts/StatusBar/StatusBar.ts'

test('getStatusBarItem', () => {
  expect(StatusBar.getStatusBarItem()).toEqual({
    icon: 'MaskIconCheck',
    text: 'Prettier',
    title: 'Prettier',
  })
})
