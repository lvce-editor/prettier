export interface ExtensionRpc {
  readonly id: string
  readonly url: string
}

export interface ExtensionManifest {
  readonly rpc: readonly ExtensionRpc[]
}

const localPrettierRpcId = 'builtin.prettier.local'

export const productionNodeEntryPoint = 'node/dist/prettierNode.js'

export const withProductionNodeEntryPoint = (
  manifest: Readonly<ExtensionManifest>,
): ExtensionManifest => {
  let foundNodeRpc = false
  const rpc = manifest.rpc.map((entry) => {
    if (entry.id !== localPrettierRpcId) {
      return entry
    }
    foundNodeRpc = true
    return {
      ...entry,
      url: productionNodeEntryPoint,
    }
  })
  if (!foundNodeRpc) {
    throw new Error(
      `Expected extension manifest to include ${localPrettierRpcId}`,
    )
  }
  return {
    ...manifest,
    rpc,
  }
}
