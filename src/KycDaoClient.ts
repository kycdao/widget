import {
	BootstrapIframeKycDaoModal,
	BootstrapKycDaoModal,
} from "./BootstrapKycDaoModal"
import {
	KycDaoClientInterface,
	KycDaoClientMessage,
	KycDaoClientOptions,
} from "./KycDaoClientCommon"

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
			this.parent.style.setProperty(
				"--backdrop",
				typeof this.backdrop === "boolean"
					? "rgba(0, 0, 0, 0.7)"
					: this.backdrop
			)
			this.parent.style.setProperty("z-index", "101")
		}

		const container = document.createElement("div")

		if (this.isModal) {
			container.classList.add("KycDaoModalFrame")
		}

		this.modal.appendChild(container)

		this.parent.appendChild(this.modal)
		this.isOpen = true

		window.addEventListener("message", this.messageHndlr)

		if (this.configFromUrl) {
			BootstrapIframeKycDaoModal({
				parent: container,
			})
		} else {
			BootstrapKycDaoModal({
				config: this.config,
				height: this.height,
				parent: container,
				width: this.width,
				isModal: this.isModal,
			})
		}

		this.originalBodyHeight = document.body.style.height
		this.originalBodyOverflow = document.body.style.overflow

		document.body.style.setProperty("height", "100%")
		document.body.style.setProperty("overflow", "hidden")
	}
}

kycDaoClient.prototype.close = function (this: KycDaoClientInterface) {
	if (this.isOpen && this.modal) {
		const parentNode = this.getParentElement()

		if (this.isModal) {
			parentNode.classList.remove("KycDaoModalRoot")
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

window.KycDaoClient = kycDaoClient as unknown as {
	new (config: KycDaoClientOptions): KycDaoClientInterface
}

export const KycDaoClient = kycDaoClient as unknown as {
	new (config: KycDaoClientOptions): KycDaoClientInterface
}
