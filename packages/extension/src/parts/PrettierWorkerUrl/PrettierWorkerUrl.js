export const getPrettierWorkerUrl = () => {
  return new URL(
    '../../../../prettier-worker/src/prettierWorkerMain.js',
    import.meta.url
  ).toString()
}
