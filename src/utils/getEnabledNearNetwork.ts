import { BlockchainNetwork } from "@kycdao/kycdao-sdk"

export const nearNetworkRegex = () => /.*Near*./g

const getEnabledNearNetwork = (
	enabledBlockchainNetworks: BlockchainNetwork[]
): BlockchainNetwork => {
	return enabledBlockchainNetworks.find((network) =>
		nearNetworkRegex().test(network)
	) as BlockchainNetwork
}

export default getEnabledNearNetwork
