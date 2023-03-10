import {
	BlockchainNetwork,
	KycDaoInitializationResult,
	SdkConfiguration,
} from "@kycdao/kycdao-sdk"
import {
	IframeOptions,
	KycDaoClientInterface,
	KycDaoClientMessage,
	KycDaoClientOptions,
	WelcomeString,
	getParentElement,
	messageHndlr,
	nearNetworkRegex,
	nearRedirectCheck,
} from "./StandaloneClientCommon"

// basically the KycDaoClient.css
const styles = `
.KycDaoModalIFrame {
	box-shadow: 0px 1px 174px rgba(59, 31, 69, 0.2);
	width: 100%;
	height: 100%;
	background-color: #fefefe;
	position: absolute;
	overflow: hidden;
	border: 0px;
	border-width: 0;
}

.KycDaoIframeModalRoot {
	width: 100%;
	position: absolute;
	inset: 0;
	background: var(--kyc-dao-backdrop);
}

@media only screen and (max-width: 992px) { 
	body:has(.KycDaoIframeModalRoot) {
		overflow: hidden;
	}
	.KycDaoIframeModalRoot {
		position: fixed;
	}
}

@media only screen and (min-width: 992px) {
	.KycDaoModalIFrame {
		width: var(--width);
		height: var(--height);
		margin: auto;
		border-radius: 12px;
		overflow: hidden;
		inset: 0;
	}

	.KycDaoIframeModalRoot {
		position: fixed;
		overflow: hidden;
		height: 100vh;
	}
}
`.replace(/\t|\n*/gm, "")

const styleNode = document.createElement("style")
styleNode.innerText = styles

document.head.appendChild(styleNode)

export type KycDaoIframeClientOptions = KycDaoClientOptions & {
	iframeOptions: IframeOptions
}

export class KycDaoIframeClient implements KycDaoClientInterface {
	messageHndlr: ({ data: { data, type } }: KycDaoClientMessage) => void
	height: string
	width: string
	parent: HTMLElement | string = document.body
	onFail
	onSuccess
	config
	configFromUrl = false
	backdrop = true
	modal?: HTMLDivElement
	onReady?: (kycDaoSdkInstance: KycDaoInitializationResult) => void
	isOpen = false
	isSuccessful = false
	isModal = false
	container?: HTMLDivElement
	originalParentZIndex: null | string = null
	iframeOptions: IframeOptions
	getParentElement: () => HTMLElement

	constructor({
		height = 650,
		width = 400,
		parent = document.body,
		onFail,
		onSuccess,
		iframeOptions,
		config,
		backdrop = true,
		modal = true,
	}: KycDaoIframeClientOptions) {
		if ("virtualKeyboard" in navigator) {
			navigator.virtualKeyboard.overlaysContent = true
		}

		this.config = config
		this.iframeOptions = iframeOptions

		this.width = typeof width === "string" ? width : `${width}px`
		this.height = typeof height === "string" ? height : `${height}px`

		this.isOpen = false
		this.parent = parent
		this.onFail = onFail
		this.onSuccess = onSuccess
		this.isSuccessful = false
		this.isModal = modal
		this.backdrop = backdrop

		this.messageHndlr = messageHndlr.bind(this)
		this.getParentElement = getParentElement.bind(this)

		console.log(WelcomeString)

		const nearNetwork = this.config.enabledBlockchainNetworks.find(
			(network) => {
				nearNetworkRegex.lastIndex = 0

				return nearNetworkRegex.test(network)
			}
		)

		if (nearNetwork && nearRedirectCheck()) {
			this.container = document.createElement("div")

			this.open(nearNetwork)
		}
	}

	open(
		blockchain?: BlockchainNetwork,
		ethProvider?: KycDaoClientOptions["config"]["evmProvider"]
	) {
		if (!this.iframeOptions) {
			throw new Error("iframeOptions are not set!")
		}

		if (!this.iframeOptions.url) {
			throw new Error(
				"An URL is needed if you want to use an iframe! What do you want to display?"
			)
		}

		if (!this.isOpen) {
			const config = { ...this.config } as SdkConfiguration
			const [currentChain] = config.enabledBlockchainNetworks

			config.enabledBlockchainNetworks = [blockchain || currentChain]

			if (ethProvider) {
				config.evmProvider = ethProvider
			}

			const params = new URLSearchParams()
			const paramSetter = ({ 0: key, 1: value }: { 0?: string; 1?: string }) =>
				key &&
				value &&
				params.set(
					key,
					Array.isArray(value) ? `["${value.join('","')}"]` : value
				)

			Object.entries(config).forEach(paramSetter)
			Object.entries(this.iframeOptions).forEach(paramSetter)

			params.set("messageTargetOrigin", window.location.origin)

			this.parent = this.getParentElement() || document.body
			if (this.isModal) {
				this.parent.classList.add("KycDaoIframeModalRoot")
			}
			if (this.backdrop && this.isModal) {
				this.originalParentZIndex =
					this.parent.style.getPropertyValue("z-index")

				this.parent.style.setProperty(
					"--kyc-dao-backdrop",
					typeof this.backdrop === "boolean"
						? "rgba(0, 0, 0, 0.7)"
						: this.backdrop
				)
				this.parent.style.setProperty("z-index", "101")
			}

			this.modal = document.createElement("div")

			if (this.isModal) {
				this.modal.classList.add("KycDaoIframeModalRoot")
				this.modal.style.setProperty("--width", this.width)
				this.modal.style.setProperty("--height", this.height)
			}

			const container = document.createElement("iframe")
			container.allow = "encrypted-media; camera"
			container.src = this.iframeOptions.url + "?" + params.toString()
			container.width = this.width
			container.height = this.height

			if (this.isModal) {
				container.classList.add("KycDaoModalIFrame")
			}

			this.modal.appendChild(container)

			this.parent.appendChild(this.modal)
			this.isOpen = true

			if ("virtualKeyboard" in navigator) {
				navigator.virtualKeyboard.overlaysContent = true
			}

			window.addEventListener("message", this.messageHndlr)
		}
	}

	close() {
		if (this.isOpen && this.modal) {
			const parentNode = this.getParentElement()

			if (this.isModal) {
				parentNode.classList.remove("KycDaoIframeModalRoot")
				parentNode.style.setProperty("z-index", this.originalParentZIndex)

				if (this.backdrop) {
					parentNode.style.setProperty("--kyc-dao-backdrop", null)
				}
			}

			this.container?.remove()
			parentNode.removeChild(this.modal)

			window.removeEventListener("message", this.messageHndlr)
			this.isOpen = false
		}
	}
}

window.KycDaoIframeClient = KycDaoIframeClient
