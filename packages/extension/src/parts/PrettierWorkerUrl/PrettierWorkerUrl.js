export const getPrettierWorkerUrl = () => {
  return new URL(
    '../../../../prettier-worker/src/prettierWorkerMain.ts',
    import.meta.url,
  ).toString()
}
