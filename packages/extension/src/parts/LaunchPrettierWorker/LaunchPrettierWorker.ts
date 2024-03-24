import * as LaunchWorker from '../LaunchWorker/LaunchWorker.ts'
import * as PrettierWorkerUrl from '../PrettierWorkerUrl/PrettierWorkerUrl.ts'

export const launchPrettierWorker = () => {
  return LaunchWorker.launchWorker({
    url: PrettierWorkerUrl.prettierWorkerUrl,
    name: 'Prettier Worker',
    contentSecurityPolicy: "default-src 'none'; script-src 'self'",
  })
}
