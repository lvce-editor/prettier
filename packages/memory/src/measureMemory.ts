import { measureMemory } from '@lvce-editor/measure-memory'
import { playwrightPath, threshold, workerPath } from './config.ts'

const main = async () => {
  await measureMemory({
    playwrightPath,
    workerPath,
    threshold,
  })
}

main()
