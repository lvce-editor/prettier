export class FormattingError extends Error {
  code: string

  constructor(message: string) {
    super(message)
    this.name = 'FormattingError'
    this.code = 'E_FORMATTING_FAILED'
  }
}
