export class FormattingError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FormattingError'
    // @ts-ignore
    this.code = 'E_FORMATTING_FAILED'
  }
}
