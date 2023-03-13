import { BlockchainNetwork } from "@kycdao/kycdao-sdk"

const getEnabledNearNetwork = (
	enabledBlockchainNetworks: BlockchainNetwork[]
): BlockchainNetwork => {
	const nearNetworkRegex = /Near*./g

	return enabledBlockchainNetworks.find((network) =>
		nearNetworkRegex.test(network)
	) as BlockchainNetwork
}

export default getEnabledNearNetwork
