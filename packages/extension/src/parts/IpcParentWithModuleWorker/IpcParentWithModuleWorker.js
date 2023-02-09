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
      this.worker.postMessage(message)
    },
    set onmessage(listener) {
      this.worker.onmessage = listener
    },
  }
}
