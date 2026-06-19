import * as Format from '../Format/Format.ts'

export const id = 'prettier'

export const label = 'Prettier'

export const languageId = 'css'

export const format = async (textDocument) => {
  const { uri } = textDocument
  const { text } = textDocument
  const start = performance.now()
  const minimizedEdit = await Format.format(uri, text)
  const end = performance.now()
  console.log('took', end - start, 'ms')
  if (!minimizedEdit) {
    return []
  }
  return [
    {
      endOffset: minimizedEdit.endOffset,
      inserted: minimizedEdit.inserted,
      startOffset: minimizedEdit.startOffset,
    },
  ]
}
