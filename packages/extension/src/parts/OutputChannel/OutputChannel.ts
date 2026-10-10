import { createOutputChannel } from '@lvce-editor/api'

const channel = createOutputChannel('prettier')

export const log = async (message: string): Promise<void> => {
  await channel.appendLine(message)
}
