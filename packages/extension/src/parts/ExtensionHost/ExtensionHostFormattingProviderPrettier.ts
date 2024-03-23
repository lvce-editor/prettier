import * as Format from '../Format/Format.ts'

export const id = 'prettier'

export const label = 'Prettier'

export const languageId = 'css'

export const format = async (textDocument) => {
  const uri = textDocument.uri
  // @ts-expect-error
  const text = vscode.getTextFromTextDocument(textDocument)
  const start = performance.now()
  const minimizedEdit = await Format.format(uri, text)
  const end = performance.now()
  console.log('took', end - start, 'ms')
  if (!minimizedEdit) {
    return []
  }
  return [
    {
      startOffset: minimizedEdit.startOffset,
      endOffset: minimizedEdit.endOffset,
      inserted: minimizedEdit.inserted,
    },
  ]
}
