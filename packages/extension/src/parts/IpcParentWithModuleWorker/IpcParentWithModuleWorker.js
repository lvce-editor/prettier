export const create = async () => {
  const workerUrl = new URL(
    '../../../packages/prettier-worker/src/prettierWorkerMain.js',
    import.meta.url
  ).toString()
  const worker = await vscode.createWorker({
    method: 'moduleWorker',
    url: workerUrl,
    name: 'Prettier Worker',
  })
  return worker
}

export const wrap = (worker) => {
  return {
    worker,
    send(message) {
      this.worker.postMessage(message)
    },
  }
}
