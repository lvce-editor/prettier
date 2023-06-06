export class FormattingError extends Error {
  constructor(message) {
    super(message)
    this.name = 'FormattingError'
    this.code = 'E_FORMATTING_FAILED'
  }
}
