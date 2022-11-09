import * as Format from '../Format/Format.js'

export const id = 'prettier'

export const label = 'Prettier'

export const languageId = 'css'

export const format = async (textDocument) => {
  const uri = textDocument.uri
  const text = vscode.getTextFromTextDocument(textDocument)
  const formattedText = await Format.format(uri, text)
  if (text === formattedText) {
    return null
  }
  return formattedText
}
