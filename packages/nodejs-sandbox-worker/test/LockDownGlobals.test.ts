/* eslint-disable @typescript-eslint/no-floating-promises */
import { strictEqual } from 'node:assert/strict'
import { test } from 'node:test'
import { lockDownGlobals } from '../src/parts/LockDownGlobals/LockDownGlobals.ts'

test('removes ambient network, storage, and parent-worker capabilities', () => {
  lockDownGlobals()

  strictEqual(globalThis.fetch, undefined)
  strictEqual(globalThis.navigator, undefined)
  strictEqual(globalThis.postMessage, undefined)
  strictEqual(WebSocket, undefined)
})
