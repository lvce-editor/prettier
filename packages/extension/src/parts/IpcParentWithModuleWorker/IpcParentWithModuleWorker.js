export const create = async ({ url, name }) => {
  const worker = await vscode.createWorker({
    method: 'moduleWorker',
    url,
    name,
  })
  return worker
}

export const wrap = (worker) => {
  return {
    worker,
    send(message) {
      this.worker.send(message)
    },
    set onmessage(listener) {
      const wrappedListener = (message) => {
        listener({ data: message })
      }
      this.worker.onmessage = wrappedListener
    },
  }
}
