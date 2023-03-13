/// <reference types="react-scripts" />
import { MetaMaskInpageProvider } from "@metamask/providers"
import {
	StandaloneClientHandle,
	StandaloneClientOptions,
} from "./StandaloneClient"
import {
	StandaloneIframeClientHandle,
	StandaloneIframeClientOptions,
} from "./StandaloneIframeClient"

type VirtualKeyboardEvent = UIEvent & {
	target: { boundingRect: { height: string } }
}

declare global {
	interface Window {
		ethereum: MetaMaskInpageProvider
		KycDaoWidget: {
			init: (options: StandaloneClientOptions) => StandaloneClientHandle
		}
		KycDaoIframeWidget: {
			init: (
				options: StandaloneIframeClientOptions
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
