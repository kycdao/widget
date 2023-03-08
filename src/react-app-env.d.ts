/// <reference types="react-scripts" />
import type { MetaMaskInpageProvider } from "@metamask/providers"
import type { KycDaoWidgetConfig } from "./widget"
import {
	KycDaoIframeClient,
	KycDaoIframeClientOptions,
} from "KycDaoIframeClient"
import { KycDaoClient } from "KycDaoClient"

type VirtualKeyboardEvent = UIEvent & {
	target: { boundingRect: { height: string } }
}

declare global {
	interface Window {
		ethereum: MetaMaskInpageProvider
		KycDaoClient: {
			new (config: KycDaoClientOptions): KycDaoClient
		}
		KycDaoIframeClient: {
			new (config: KycDaoIframeClientOptions): KycDaoIframeClient
		}
		KycDaoWidget: React.FC<KycDaoWidgetConfig>
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
