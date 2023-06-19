import * as ImprovePrettierError from '../src/parts/ImprovePrettierError/ImprovePrettierError.js'

class CssSyntaxError extends Error {
  constructor({ line, column, endLine, endColumn, reason, message }) {
    super(message)
    this.name = 'CssSyntaxError'
    this.column = column
    this.endLine = endLine
    this.line = line
    this.endColumn = endColumn
    this.reason = reason
    this.message = message
  }
}

test('improvePrettierError - css syntax error', async () => {
  const column = 3
  const endColumn = 12
  const endLine = 2
  const line = 2
  const reason = 'Unknown word'
  const message = '<css input>:2:3: Unknown word'
  const cause = new CssSyntaxError({
    column,
    endColumn,
    endLine,
    line,
    reason,
    message,
  })
  const error = new SyntaxError(`CssSyntaxError: Unknown word (2:3)
  1 | h1 {
> 2 |   font-size 10px
    |   ^
  3 | }`)
  error.cause = cause
  error.stack = `"SyntaxError: CssSyntaxError: Unknown word (2:3)
  1 | h1 {
> 2 |   font-size 10px
    |   ^
  3 | }
    at ql (/test/packages/prettier-worker/third_party/prettier-v3/plugins/postcss.mjs:44:2668)
    at gi (/test/packages/prettier-worker/third_party/prettier-v3/plugins/postcss.mjs:50:7877)
    at Object.vl [as parse] (/test/packages/prettier-worker/third_party/prettier-v3/plugins/postcss.mjs:50:8167)
    at async Fr (/test/packages/prettier-worker/third_party/prettier-v3/standalone.mjs:43:4349)
    at async Ul (/test/packages/prettier-worker/third_party/prettier-v3/standalone.mjs:44:14169)
    at async Jl (/test/packages/prettier-worker/third_party/prettier-v3/standalone.mjs:48:581)
    at async Module.DA (/test/packages/prettier-worker/third_party/prettier-v3/standalone.mjs:105:6277)
    at async format (/test/packages/prettier-worker/src/parts/Format/Format.js:33:27)
    at async getResponse (/test/packages/extension-host-sub-worker/dist/extensionHostSubWorkerMain.js:1055:20)
    at async handleJsonRpcMessage (/test/packages/extension-host-sub-worker/dist/extensionHostSubWorkerMain.js:1067:20)`
  const improvedError = ImprovePrettierError.improvePrettierError(error)
  expect(improvedError.message).toBe(`CssSyntaxError: Unknown word`)
  expect(improvedError.codeFrame).toBe(`  1 | h1 {
> 2 |   font-size 10px
    |   ^
  3 | }`)
  expect(improvedError.stack)
    .toMatch(`    at ql (/test/packages/prettier-worker/third_party/prettier-v3/plugins/postcss.mjs:44:2668)
    at gi (/test/packages/prettier-worker/third_party/prettier-v3/plugins/postcss.mjs:50:7877)
    at Object.vl [as parse] (/test/packages/prettier-worker/third_party/prettier-v3/plugins/postcss.mjs:50:8167)
    at async Fr (/test/packages/prettier-worker/third_party/prettier-v3/standalone.mjs:43:4349)
    at async Ul (/test/packages/prettier-worker/third_party/prettier-v3/standalone.mjs:44:14169)
    at async Jl (/test/packages/prettier-worker/third_party/prettier-v3/standalone.mjs:48:581)
    at async Module.DA (/test/packages/prettier-worker/third_party/prettier-v3/standalone.mjs:105:6277)
    at async format (/test/packages/prettier-worker/src/parts/Format/Format.js:33:27)`)
})
