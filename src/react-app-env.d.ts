/// <reference types="react-scripts" />
import { MetaMaskInpageProvider } from "@metamask/providers"
import { KycDaoWidgetConfig } from "./widget"

type VirtualKeyboardEvent = UIEvent & {
	target: { boundingRect: { height: string } }
}

declare global {
	interface Window {
		ethereum: MetaMaskInpageProvider
		KycDaoClient
		KycDaoIframeClient
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
