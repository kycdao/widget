import {
	BlockchainNetwork,
	KycDaoInitializationResult,
} from "@kycdao/kycdao-sdk"
import {
	BootstrapIframeKycDaoModal,
	BootstrapKycDaoModal,
} from "./BootstrapKycDaoModal"
import {
	KycDaoClientInterface,
	KycDaoClientMessage,
	KycDaoClientOptions,
	WelcomeString,
	getParentElement,
	messageHndlr,
	nearNetworkRegex,
	nearRedirectCheck,
} from "./KycDaoClientCommon"

// basically the KycDaoClient.css
const styles = `
	.KycDaoModalRoot {
		width: 100%;
		position: absolute;
		inset: 0;
		background: var(--kyc-dao-backdrop);
	}

	.KycDaoModalFrame {
		box-shadow: 0px 1px 174px rgba(59, 31, 69, 0.2);
		width: 100%;
		height: 100%;
		background-color: #fefefe;
		position: absolute;
		overflow: hidden;
	}

	@media only screen and (max-width: 992px) {
		body:has(.KycDaoModalRoot) {
			overflow: hidden;
		}
		.KycDaoModalRoot {
			position: fixed;
		}
	}

	@media only screen and (min-width: 992px) {
		.KycDaoModalFrame {
			width: var(--width);
			height: var(--height);
			margin: auto;
			border-radius: 12px;
			overflow: hidden;
			inset: 0;
		}

		.KycDaoModalRoot {
			position: fixed;
			overflow: hidden;
			height: 100vh;
		}
	}
`.replace(/\t|\n*/gm, "")

const styleNode = document.createElement("style")
styleNode.innerText = styles

document.head.appendChild(styleNode)

export class KycDaoClient implements KycDaoClientInterface {
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
	getParentElement: () => HTMLElement

	constructor({
		height = "650px",
		width = "400px",
		parent = document.body,
		onFail,
		onSuccess,
		config,
		configFromUrl = false,
		backdrop = true,
		modal = true,
		onReady,
	}: KycDaoClientOptions) {
		this.config = config

		this.width = typeof width === "string" ? width : `${width}px`
		this.height = typeof height === "string" ? height : `${height}px`

		this.parent = parent
		this.onFail = onFail
		this.onSuccess = onSuccess
		this.backdrop = backdrop
		this.isModal = modal

		this.configFromUrl = configFromUrl
		this.onReady = onReady

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
		if (!this.isOpen) {
			this.container = document.createElement("div")
			const currentEthProvider = ethProvider || this.config.evmProvider

			const enabledBlockchainNetwork = blockchain
				? [blockchain]
				: [this.config.enabledBlockchainNetworks[0]]

			this.parent = this.getParentElement() || document.body

			if (this.configFromUrl) {
				BootstrapIframeKycDaoModal({
					parent: this.container,
				})
			} else {
				BootstrapKycDaoModal({
					config: {
						...this.config,
						enabledBlockchainNetworks: enabledBlockchainNetwork,
						evmProvider: currentEthProvider,
					},
					height: this.height,
					parent: this.container,
					width: this.width,
					isModal: this.isModal,
					onReady: this.onReady,
				})
			}

			if (this.isModal) {
				this.parent.classList.add("KycDaoModalRoot")
			}

			this.modal = document.createElement("div")

			if (this.isModal) {
				this.modal.classList.add("KycDaoModal")
				this.modal.style.setProperty("--width", this.width)
				this.modal.style.setProperty("--height", this.height)
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

			if (this.isModal) {
				this.container.classList.add("KycDaoModalFrame")
			}

			this.modal.appendChild(this.container)

			this.parent.appendChild(this.modal)
			this.isOpen = true

			window.addEventListener("message", this.messageHndlr)
		}
	}

	close() {
		if (this.isOpen && this.modal) {
			const parentNode = this.getParentElement()

			if (this.isModal) {
				parentNode.classList.remove("KycDaoModalRoot")
				parentNode.style.setProperty("z-index", this.originalParentZIndex)

				if (this.backdrop) {
					parentNode.style.setProperty("--kyc-dao-backdrop", null)
				}
			}

			this.container?.remove()
			parentNode.removeChild(this.modal)

			window.removeEventListener("message", this.messageHndlr)
			this.isOpen = false
			// document.body.style.setProperty("height", this.originalBodyHeight)
		}
	}
}

window.KycDaoClient = KycDaoClient
