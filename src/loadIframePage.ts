import { StandaloneClient } from "./index"
import qs from "qs"
import { SdkConfiguration } from "@kycdao/kycdao-sdk"
import { KycDaoMessageTypes } from "./types"

interface SdkConfigurationWithMessageTargetOrigin extends SdkConfiguration {
	messageTargetOrigin: string
}

const walletConnectEvmProvider = new window.WalletConnectProvider.default({
	rpc: {
		1: "https://rpc.ankr.com/eth",
		5: "https://rpc.ankr.com/eth_goerli",
		137: "https://rpc-mainnet.maticvigil.com/",
		80001: "https://rpc-mumbai.maticvigil.com/",
		44787: "https://alfajores-forno.celo-testnet.org",
	},
	chainId: 80001,
})

/**
 * This is an internal function that is used to load our hosted iframe page.
 */
const loadIframePage = () => {
	const queryParams = qs.parse(window.location.search, {
		ignoreQueryPrefix: true,
	})

	const { messageTargetOrigin, ...config } = {
		...queryParams,
		evmProvider: window.ethereum,
	} as SdkConfigurationWithMessageTargetOrigin

	if (queryParams.evmProvider === "walletConnect") {
		config.evmProvider = walletConnectEvmProvider
	}

	// todo: runtime validate query params
	const kycDao = StandaloneClient.init({
		container: "#iframeModalRoot",
		isModal: true,
		config,
		onSuccess: (data) => {
			window.top?.postMessage(
				{
					type: KycDaoMessageTypes.SUCCESS,
					data,
				},
				messageTargetOrigin
			)
		},
		onFail: (error) => {
			window.top?.postMessage(
				{
					type: KycDaoMessageTypes.FAIL,
					data: error,
				},
				messageTargetOrigin
			)
		},
		onReady: () => {
			window.top?.postMessage(
				{
					type: KycDaoMessageTypes.READY,
				},
				messageTargetOrigin
			)
		},
	})

	kycDao.open(config.enabledBlockchainNetworks[0])
}

export default loadIframePage

window.loadIframePage = loadIframePage
