/// <reference types="react-scripts" />
import { MetaMaskInpageProvider } from "@metamask/providers"
import {
	KycDaoClientOptions,
	KycDaoClientInterface,
} from "./KycDaoClientCommon"
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
		// todo: remove
		KycDaoClient: {
			new (config: KycDaoClientOptions): KycDaoClientInterface
		}
		// todo: remove
		KycDaoIframeClient: {
			new (config: KycDaoClientOptions): KycDaoClientInterface
		}
		KycDaoWidget: {
			open: (config: StandaloneClientConfig) => StandaloneClientHandle
		}
		KycDaoIframeWidget: {
			open: (
				config: StandaloneIframeClientConfig
			) => StandaloneIframeClientHandle
		}
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
