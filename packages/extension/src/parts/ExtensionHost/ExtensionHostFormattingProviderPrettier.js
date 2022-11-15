import * as Format from '../Format/Format.js'

export const id = 'prettier'

export const label = 'Prettier'

export const languageId = 'css'

export const format = async (textDocument) => {
  const uri = textDocument.uri
  const text = vscode.getTextFromTextDocument(textDocument)
  console.log({ text })
  const start = performance.now()
  const formattedText = await Format.format(uri, text)
  const end = performance.now()
  console.log('took', end - start, 'ms')
  if (text === formattedText) {
    return []
  }
  return [
    {
      startOffset: 0,
      endOffset: text.length,
      inserted: formattedText,
    },
  ]
}
