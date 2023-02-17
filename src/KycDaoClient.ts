import {
	BootstrapIframeKycDaoModal,
	BootstrapKycDaoModal,
} from "./BootstrapKycDaoModal"
import {
	KycDaoClientInterface,
	KycDaoClientMessage,
	KycDaoClientOptions,
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

function kycDaoClient(
	this: KycDaoClientInterface,
	{
		height = 650,
		width = 400,
		parent = document.body,
		onFail,
		onSuccess,
		iframeOptions,
		config,
		configFromUrl = false,
		backdrop = true,
		modal = true,
		onReady,
	}: KycDaoClientOptions
) {
	this.config = config
	this.iframeOptions = iframeOptions

	this.width = typeof width === "string" ? width : `${width}px`
	this.height = typeof height === "string" ? height : `${height}px`

	this.isOpen = false
	this.parent = parent
	this.onFail = onFail
	this.onSuccess = onSuccess
	this.isSuccessful = false
	this.backdrop = backdrop
	this.isModal = modal

	this.messageHndlr = this.messageHndlr.bind(this)
	this.open = this.open.bind(this)
	this.close = this.close.bind(this)
	this.getParentElement = this.getParentElement.bind(this)

	this.configFromUrl = configFromUrl
	this.onReady = onReady

	this.container = document.createElement("div")

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

	/**
	 * Compile time environment variable injection by babel-plugin-transform-inline-environment-variables & webpack.DefinePlugin.
	 * 	{@link https://www.npmjs.com/package/babel-plugin-transform-inline-environment-variables package/babel-plugin-transform-inline-environment-variables}
	 *	{@link https://webpack.js.org/plugins/define-plugin define-plugin}
	 */
	console.log(
		`Thank you for using ${process.env.npm_package_name} version ${process.env.npm_package_version}+${process.env.REACT_APP_GIT_HASH}`
	)
}

kycDaoClient.prototype.messageHndlr = function (
	this: KycDaoClientInterface,
	{ data: { data, type } }: KycDaoClientMessage
) {
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

kycDaoClient.prototype.getParentElement = function (
	this: KycDaoClientInterface
) {
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

kycDaoClient.prototype.open = function (this: KycDaoClientInterface) {
	if (!this.isOpen) {
		this.parent = this.getParentElement() || document.body

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
			this.originalParentZIndex = this.parent.style.getPropertyValue("z-index")

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

		//this.originalBodyHeight = document.body.style.height

		// document.body.style.setProperty("height", "100%")
	}
}

kycDaoClient.prototype.close = function (this: KycDaoClientInterface) {
	if (this.isOpen && this.modal) {
		const parentNode = this.getParentElement()

		if (this.isModal) {
			parentNode.classList.remove("KycDaoModalRoot")
			parentNode.style.setProperty("z-index", this.originalParentZIndex)

			if (this.backdrop) {
				parentNode.style.setProperty("--kyc-dao-backdrop", null)
			}
		}

		if (parentNode) {
			parentNode.removeChild(this.modal)
		}
		window.removeEventListener("message", this.messageHndlr)
		this.isOpen = false
		// document.body.style.setProperty("height", this.originalBodyHeight)
	}
}

window.KycDaoClient = kycDaoClient as unknown as {
	new (config: KycDaoClientOptions): KycDaoClientInterface
}

export const KycDaoClient = kycDaoClient as unknown as {
	new (config: KycDaoClientOptions): KycDaoClientInterface
}
