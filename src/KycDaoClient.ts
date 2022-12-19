import {
	BootstrapIframeKycDaoModal,
	BootstrapKycDaoModal,
} from "./BootstrapKycDaoModal"
import "./KycDaoClient.scss"
import {
	KycDaoClientInterface,
	KycDaoClientMessage,
	KycDaoClientOptions,
} from "./KycDaoClientCommon"

export function KycDaoClient(
	this: KycDaoClientInterface,
	{
		height = "100%",
		width = "100%",
		parent = document.body,
		onFail,
		onSuccess,
		iframeOptions,
		config,
		configFromUrl = false,
		backdrop = true,
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

	this.messageHndlr = this.messageHndlr.bind(this)
	this.open = this.open.bind(this)
	this.close = this.close.bind(this)
	this.getParentElement = this.getParentElement.bind(this)

	this.configFromUrl = configFromUrl
}

KycDaoClient.prototype.messageHndlr = function (
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

KycDaoClient.prototype.getParentElement = function (
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

KycDaoClient.prototype.open = function (this: KycDaoClientInterface) {
	if (!this.isOpen) {
		this.parent = this.getParentElement() || document.body
		this.parent.classList.add("KycDaoModalRoot")

		this.modal = document.createElement("div")
		this.modal.classList.add("KycDaoModal")
		this.modal.style.setProperty("--width", this.width)
		this.modal.style.setProperty("--height", this.height)

		if (this.backdrop) {
			this.parent.style.setProperty(
				"--backdrop",
				typeof this.backdrop === "boolean"
					? "rgba(0, 0, 0, 0.7)"
					: this.backdrop
			)
		}

		const container = document.createElement("div")

		container.classList.add("KycDaoModalFrame")

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
			})
		}
	}
}

KycDaoClient.prototype.close = function (this: KycDaoClientInterface) {
	if (this.isOpen && this.modal) {
		const parentNode = this.getParentElement()
		parentNode.classList.remove("KycDaoModalRoot")

		if (parentNode) {
			parentNode.removeChild(this.modal)
		}
		window.removeEventListener("message", this.messageHndlr)
		this.isOpen = false
	}
}

window.KycDaoClient = KycDaoClient
