import {
  formatWithLocalPrettier,
  loadLocalPrettier,
} from '../LocalPrettier/LocalPrettier.ts'

export const commandMap: Record<string, (...params: any[]) => any> = {
  'NodeJsSandbox.formatWithLocalPrettier': formatWithLocalPrettier,
  'NodeJsSandbox.loadLocalPrettier': loadLocalPrettier,
}
