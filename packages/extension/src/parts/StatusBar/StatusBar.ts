import type { StatusBarItem } from '@lvce-editor/api'

export const id = 'prettier.status'

export const getStatusBarItem = (): StatusBarItem => {
  return {
    icon: 'MaskIconCheck',
    text: 'Prettier',
    title: 'Prettier',
  }
}
