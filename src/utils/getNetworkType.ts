export const getNetworkType = (
  network: string
): "Solana" | "Ethereum" | "Near" | "Aptos" => {
  const test = network.match("(Solana|Ethereum|Near|Aptos)")?.[0]

  if (!test) {
    switch (network) {
      case "PolygonMainnet":
      case "PolygonMumbai":
      case "CeloMainnet":
      case "CeloAlfajores":
      case "EthereumMainnet":
      case "EthereumGoerli":
      case "BaseGoerli":
      case "ArbitrumGoerli":
      case "ZKSyncGoerli":
        return "Ethereum"
    }
  }

  if (
    test !== "Solana" &&
    test !== "Near" &&
    test !== "Aptos" &&
    test !== "Ethereum"
  ) {
    throw Error("Unknown network!")
  }

  return test
}
