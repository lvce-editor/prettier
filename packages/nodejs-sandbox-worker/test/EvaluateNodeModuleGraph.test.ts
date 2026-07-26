/* eslint-disable @typescript-eslint/no-floating-promises */
import { deepStrictEqual, strictEqual, throws } from 'node:assert/strict'
import { test } from 'node:test'
import { evaluate } from '../src/parts/EvaluateNodeModuleGraph/EvaluateNodeModuleGraph.ts'

test('evaluates a CommonJS module graph with cycles', () => {
  const entries = evaluate({
    entries: {
      main: '/workspace/main.cjs',
    },
    modules: [
      {
        dependencies: {
          './value.cjs': '/workspace/value.cjs',
        },
        id: '/workspace/main.cjs',
        source: `exports.answer = require('./value.cjs').answer`,
      },
      {
        dependencies: {
          './main.cjs': '/workspace/main.cjs',
        },
        id: '/workspace/value.cjs',
        source: `require('./main.cjs'); exports.answer = 42`,
      },
    ],
  })

  deepStrictEqual(entries.main, {
    answer: 42,
  })
})

test('does not expose Node or network globals as wrapper arguments', () => {
  const entries = evaluate({
    entries: {
      main: '/workspace/main.cjs',
    },
    modules: [
      {
        dependencies: {},
        id: '/workspace/main.cjs',
        source: `module.exports = {
  Buffer: typeof Buffer,
  fetch: typeof fetch,
  process: typeof process,
  WebSocket: typeof WebSocket,
}`,
      },
    ],
  })

  deepStrictEqual(entries.main, {
    Buffer: 'undefined',
    fetch: 'undefined',
    process: 'undefined',
    WebSocket: 'undefined',
  })
})

test('rejects undeclared dependencies', () => {
  throws(
    () =>
      evaluate({
        entries: {
          main: '/workspace/main.cjs',
        },
        modules: [
          {
            dependencies: {},
            id: '/workspace/main.cjs',
            source: `require('node:fs')`,
          },
        ],
      }),
    /not declared as a dependency/,
  )
})

test('supports JSON module exports', () => {
  const entries = evaluate({
    entries: {
      main: '/workspace/config.json',
    },
    modules: [
      {
        dependencies: {},
        id: '/workspace/config.json',
        source: `module.exports = {"semi":false}`,
      },
    ],
  })

  strictEqual((entries.main as Readonly<Record<string, unknown>>).semi, false)
})
