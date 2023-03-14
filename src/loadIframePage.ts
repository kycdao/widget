import { StandaloneClient } from "./index"
import qs from "qs"
import { SdkConfiguration } from "@kycdao/kycdao-sdk"
import { KycDaoMessageTypes } from "./types"

interface SdkConfigurationWithMessageTargetOrigin extends SdkConfiguration {
	messageTargetOrigin: string
}

/**
 * This is an internal function that is used to load our hosted iframe page.
 */
const loadIframePage = () => {
	const { messageTargetOrigin, ...config } = {
		...qs.parse(window.location.search, { ignoreQueryPrefix: true }),
		evmProvider: window.ethereum,
	} as SdkConfigurationWithMessageTargetOrigin

	// todo: runtime validate query params

	const kycDao = StandaloneClient.init({
		container: "#modalRoot",
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
					type: KycDaoMessageTypes.SUCCESS,
				},
				messageTargetOrigin
			)
		},
	})

	kycDao.open(config.enabledBlockchainNetworks[0])
}

export default loadIframePage

window.loadIframePage = loadIframePage
