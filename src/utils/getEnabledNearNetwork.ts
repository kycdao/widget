import { BlockchainNetwork } from "@kycdao/kycdao-sdk"
import { nearNetworkRegex } from "../StandaloneClientCommon"

const getEnabledNearNetwork = (
	enabledBlockchainNetworks: BlockchainNetwork[]
): BlockchainNetwork => {
	return enabledBlockchainNetworks.find((network) =>
		nearNetworkRegex().test(network)
	) as BlockchainNetwork
}

export default getEnabledNearNetwork
