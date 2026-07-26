const blockedGlobalNames = [
  'BroadcastChannel',
  'EventSource',
  'RTCPeerConnection',
  'SharedWorker',
  'WebSocket',
  'WebSocketStream',
  'WebTransport',
  'Worker',
  'XMLHttpRequest',
  'caches',
  'fetch',
  'importScripts',
  'indexedDB',
  'navigator',
  'postMessage',
]

export const lockDownGlobals = (): void => {
  for (const name of blockedGlobalNames) {
    try {
      Object.defineProperty(globalThis, name, {
        configurable: false,
        value: undefined,
        writable: false,
      })
    } catch {
      // The CSP remains the authoritative network restriction when a host
      // exposes a non-configurable global.
    }
  }
}
