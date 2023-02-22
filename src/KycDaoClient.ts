import {
	BlockchainNetwork,
	KycDaoInitializationResult,
} from "@kycdao/kycdao-sdk"
import {
	BootstrapIframeKycDaoModal,
	BootstrapKycDaoModal,
} from "./BootstrapKycDaoModal"
import type {
	KycDaoClientInterface,
	KycDaoClientMessage,
	KycDaoClientOptions,
} from "./KycDaoClientCommon"

const errorPrefix = "Wallet callback handling error"

const knownNearQueryParams = {
	account_id: "NearLogin",
	errorCode: "NearUserRejectedError",
	transactionHashes: "NearMint",
}

const nearNetworkRegex = /Near*./g

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

		this.messageHndlr = this.messageHndlr.bind(this)

		/**
		 * Compile time environment variable injection by babel-plugin-transform-inline-environment-variables & webpack.DefinePlugin.
		 * 	{@link https://www.npmjs.com/package/babel-plugin-transform-inline-environment-variables package/babel-plugin-transform-inline-environment-variables}
		 *	{@link https://webpack.js.org/plugins/define-plugin define-plugin}
		 */
		console.log(
			`Thank you for using ${process.env.npm_package_name} version ${process.env.npm_package_version}+${process.env.REACT_APP_GIT_HASH}`
		)

		const nearNetwork = this.config.enabledBlockchainNetworks.find((network) =>
			nearNetworkRegex.test(network)
		)

		if (nearNetwork && this.nearRedirectCheck()) {
			this.container = document.createElement("div")

			this.config.enabledBlockchainNetworks = [nearNetwork]
			if (this.configFromUrl) {
				BootstrapIframeKycDaoModal({
					parent: this.container,
				})
			} else {
				BootstrapKycDaoModal({
					config: this.config,
					height: this.height,
					parent: this.container,
					width: this.width,
					isModal: this.isModal,
					onReady: this.onReady,
				})
			}
			this.open()
		}
	}

	getParentElement() {
		if (typeof this.parent === "string") {
			const parentElement = document.querySelector(
				this.parent
			) as HTMLElement | null
			if (!parentElement) {
				throw new Error(
					`There is no such element as '${this.parent}', check your parent selector string!`
				)
			}

			return parentElement
		}
		return this.parent
	}

	open(
		blockchain?: BlockchainNetwork,
		ethProvider?: KycDaoClientOptions["config"]["evmProvider"]
	) {
		if (!this.isOpen) {
			this.container = document.createElement("div")
			if (ethProvider) {
				this.config.evmProvider = ethProvider
			}
			this.config.enabledBlockchainNetworks = blockchain
				? [blockchain]
				: [this.config.enabledBlockchainNetworks[0]]

			this.parent = this.getParentElement() || document.body

			if (this.configFromUrl) {
				BootstrapIframeKycDaoModal({
					parent: this.container,
				})
			} else {
				BootstrapKycDaoModal({
					config: this.config,
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

	nearRedirectCheck() {
		const knownQueryParamNames = Object.keys(knownNearQueryParams)

		const queryParams = new URLSearchParams(window.location.search)
		const matches = [...queryParams].filter(([key, _]) =>
			knownQueryParamNames.includes(key)
		)

		if (matches.length > 1) {
			console.error(
				`${errorPrefix} - Multiple URL query parameters identified: ${matches.map(
					([key]) => key
				)}.`
			)
		} else if (matches.length === 1) {
			const match = matches[0]
			const key = match[0] as keyof typeof knownNearQueryParams
			const event = knownNearQueryParams[key]

			if (event.startsWith("Near")) {
				return true
			}
		}

		return false
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

	messageHndlr({ data: { data, type } }: KycDaoClientMessage) {
		switch (type) {
			case "kycDaoCloseModal":
				if (this.onFail) {
					this.onFail("cancelled")
				}
				if (this.isOpen) {
					this.close()
				}
				break
			case "kycDaoSuccess":
				this.isSuccessful = true
				if (this.onSuccess) {
					this.onSuccess(data)
				}
				this.close()
				break
			case "kycDaoFail": {
				if (this.onFail) {
					this.onFail(data)
				}
			}
		}
	}
}

window.KycDaoClient = KycDaoClient as unknown as {
	new (config: KycDaoClientOptions): KycDaoClientInterface
}
