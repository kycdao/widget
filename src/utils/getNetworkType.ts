export const getNetworkType = (
	network: string
): "Solana" | "Ethereum" | "Near" => {
	const test = network.match("(Solana|Ethereum|Near)")?.[0]

	if (!test) {
		switch (network) {
			case "PolygonMainnet":
			case "PolygonMumbai":
			case "CeloMainnet":
			case "CeloAlfajores":
				return "Ethereum"
		}
	}

	if (test !== "Solana" && test !== "Near" && test !== "Ethereum") {
		throw Error("Unknown network!")
	}

	return test
}
