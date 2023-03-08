/// <reference types="react-scripts" />
import { MetaMaskInpageProvider } from "@metamask/providers"
import { KycDaoWidgetConfig } from "./Widget"
import {
	KycDaoClientOptions,
	KycDaoClientInterface,
} from "./KycDaoClientCommon"
import { StandaloneClientHandle } from "./StandaloneClient"

type VirtualKeyboardEvent = UIEvent & {
	target: { boundingRect: { height: string } }
}

declare global {
	interface Window {
		ethereum: MetaMaskInpageProvider
		KycDaoClient: {
			new (config: KycDaoClientOptions): KycDaoClientInterface
		}
		KycDaoIframeClient: {
			new (config: KycDaoClientOptions): KycDaoClientInterface
		}
		KycDaoWidget: {
			open: (config: KycDaoWidgetConfig) => StandaloneClientHandle
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
