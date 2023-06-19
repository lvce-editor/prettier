const RE_LINE_COLUMN = / \(\d+\:\d+\)$/

const getCauseMessage = (cause) => {
  if (!cause) {
    return ''
  }
  if (cause && cause.message) {
    const lines = cause.message.split('\n')
    const firstLine = lines[0]
    const columnMatch = firstLine.match(RE_LINE_COLUMN)
    if (columnMatch) {
      return firstLine.slice(0, -columnMatch[0].length)
    }
    return firstLine
  }
  return ''
}

const getCauseCodeFrame = (cause) => {
  if (!cause) {
    return ''
  }
  return cause.codeFrame || ''
}

export class FormattingError extends Error {
  constructor(cause, message) {
    const causeMessage = getCauseMessage(cause)
    super(`${message}: ${causeMessage}`)
    this.name = 'FormattingError'
    this.code = 'E_FORMATTING_FAILED'
    const causeCodeFrame = getCauseCodeFrame(cause)
    this.codeFrame = causeCodeFrame
  }
}
