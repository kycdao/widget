/// <reference types="react-scripts" />
import type { MetaMaskInpageProvider } from "@metamask/providers"
import type { KycDaoWidgetConfig } from "./widget"
import type {
	KycDaoClientOptions,
	KycDaoClientInterface,
} from "./KycDaoClientCommon"

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
