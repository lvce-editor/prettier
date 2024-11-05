export interface OffsetBasedEdit {
  readonly startOffset: number
  readonly endOffset: number
  readonly inserted: string
}
