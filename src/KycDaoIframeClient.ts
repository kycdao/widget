import {
	KycDaoClientInterface,
	KycDaoClientMessage,
	KycDaoClientOptions,
} from "./KycDaoClientCommon"

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

export function kycDaoIframeClient(
	this: KycDaoClientInterface,
	{
		height = 650,
		width = 400,
		parent = document.body,
		onFail,
		onSuccess,
		iframeOptions,
		config,
		backdrop = true,
		modal = true,
	}: KycDaoClientOptions
) {
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

	this.messageHndlr = this.messageHndlr.bind(this)
	this.open = this.open.bind(this)
	this.close = this.close.bind(this)
	this.getParentElement = this.getParentElement.bind(this)
	this.backdrop = backdrop
}

kycDaoIframeClient.prototype.messageHndlr = function (
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
				this.close()
			}
			break
		case "kycDaoFail": {
			if (this.onFail) {
				this.onFail(data)
			}
		}
	}
}

kycDaoIframeClient.prototype.getParentElement = function (
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

kycDaoIframeClient.prototype.open = function (this: KycDaoClientInterface) {
	if (!this.iframeOptions?.url) {
		throw new Error(
			"An URL is needed if you want to use an iframe! What do you want to display?"
		)
	}

	if (!this.isOpen) {
		const params = new URLSearchParams()
		const paramSetter = ({ 0: key, 1: value }: { 0: string; 1: string }) =>
			params.set(key, Array.isArray(value) ? `["${value.join('","')}"]` : value)

		Object.entries(this.config).forEach(paramSetter)
		Object.entries(this.iframeOptions).forEach(paramSetter)

		params.set("messageTargetOrigin", this.iframeOptions.messageTargetOrigin)

		this.parent = this.getParentElement() || document.body
		if (this.isModal) {
			this.parent.classList.add("KycDaoIframeModalRoot")
		}

		if (this.backdrop && this.isModal) {
			this.parent.style.setProperty(
				"--backdrop",
				typeof this.backdrop === "boolean"
					? "rgba(0, 0, 0, 0.7)"
					: this.backdrop
			)
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

		this.originalBodyHeight = document.body.style.height
		this.originalBodyOverflow = document.body.style.overflow

		document.body.style.setProperty("height", "100%")
		document.body.style.setProperty("overflow", "hidden")
	}
}

kycDaoIframeClient.prototype.close = function (this: KycDaoClientInterface) {
	if (this.isOpen) {
		if (this.modal) {
			const parentNode = this.getParentElement()

			if (this.isModal) {
				parentNode.classList.remove("KycDaoIframeModalRoot")
			}

			if (parentNode) {
				parentNode.removeChild(this.modal)
			}
			window.removeEventListener("message", this.messageHndlr)
			this.isOpen = false
			document.body.style.setProperty("height", this.originalBodyHeight)
			document.body.style.setProperty("overflow", this.originalBodyOverflow)
		}
	}
}

window.KycDaoIframeClient = kycDaoIframeClient as unknown as {
	new (config: KycDaoClientOptions): KycDaoClientInterface
}

export const KycDaoIframeClient = kycDaoIframeClient as unknown as {
	new (config: KycDaoClientOptions): KycDaoClientInterface
}
