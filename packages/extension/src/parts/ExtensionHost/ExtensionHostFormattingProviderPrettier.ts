import * as Format from '../Format/Format.ts'
import * as OutputChannel from '../OutputChannel/OutputChannel.ts'

interface TextDocument {
  readonly text: string
  readonly uri: string
}

interface TextEdit {
  readonly endOffset: number
  readonly inserted: string
  readonly startOffset: number
}

export const id = 'prettier'

export const label = 'Prettier'

export const languageId = 'css'

export const format = async (
  textDocument: TextDocument,
): Promise<readonly TextEdit[]> => {
  const { uri } = textDocument
  const { text } = textDocument
  const start = performance.now()
  const minimizedEdit = await Format.format(uri, text)
  const end = performance.now()
  await OutputChannel.log(`took ${end - start} ms`)
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
