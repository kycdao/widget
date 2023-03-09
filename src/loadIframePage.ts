import { StandaloneClient } from "./index"
import qs from "qs"
import { SdkConfiguration } from "@kycdao/kycdao-sdk"
import { KycDaoEventTypes, KycDaoOnReadyEvent } from "./types"

const loadIframePage = () => {
	const parsedConfig = {
		...qs.parse(window.location.search, { ignoreQueryPrefix: true }),
		evmProvider: window.ethereum,
	} as SdkConfiguration

	StandaloneClient.open({
		container: "#modalRoot",
		config: parsedConfig,
		onSuccess: () => {
			window.parent.document.dispatchEvent(
				new CustomEvent(KycDaoEventTypes.SUCCESS)
			)
		},
		onFail: () => {
			window.parent.document.dispatchEvent(
				new CustomEvent(KycDaoEventTypes.FAIL)
			)
		},
		onReady: (sdkInstance) => {
			window.parent.document.dispatchEvent(
				new CustomEvent(KycDaoEventTypes.READY, {
					data: sdkInstance,
				} as KycDaoOnReadyEvent)
			)
		},
	})
}

export default loadIframePage

window.loadIframePage = loadIframePage
