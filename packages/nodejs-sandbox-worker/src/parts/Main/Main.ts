import * as Listen from '../Listen/Listen.ts'
import { lockDownGlobals } from '../LockDownGlobals/LockDownGlobals.ts'

export const main = async (): Promise<void> => {
  await Listen.listen()
  lockDownGlobals()
}
