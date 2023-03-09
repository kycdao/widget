/// <reference types="react-scripts" />
import { MetaMaskInpageProvider } from "@metamask/providers"
import {
	StandaloneClientConfig,
	StandaloneClientHandle,
} from "./StandaloneClient"
import {
	StandaloneIframeClientConfig,
	StandaloneIframeClientHandle,
} from "./StandaloneIframeClient"

type VirtualKeyboardEvent = UIEvent & {
	target: { boundingRect: { height: string } }
}

declare global {
	interface Window {
		ethereum: MetaMaskInpageProvider
		KycDaoWidget: {
			open: (config: StandaloneClientConfig) => StandaloneClientHandle
		}
		KycDaoIframeWidget: {
			open: (
				config: StandaloneIframeClientConfig
			) => StandaloneIframeClientHandle
		}
		loadIframePage: () => void
	}

	interface Navigator {
		virtualKeyboard: {
			addEventListener(
				event: string,
				handler: (event: VirtualKeyboardEvent) => void
			)
			removeEventListener(
				event: string,
				handler: (event: VirtualKeyboardEvent) => void
			)
			overlaysContent: boolean
			boundingRect: { height: string }
		}
	}
}
