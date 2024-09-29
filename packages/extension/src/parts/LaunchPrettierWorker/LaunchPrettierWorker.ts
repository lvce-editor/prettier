import * as LaunchWorker from '../LaunchWorker/LaunchWorker.ts'

export const launchPrettierWorker = () => {
  return LaunchWorker.launchWorker({
    id: 'builtin.prettier.prettier-worker',
  })
}
