import "./KycDaoClient.scss"
import {
	KycDaoClientInterface,
	KycDaoClientMessage,
	KycDaoClientOptions,
} from "./KycDaoClientCommon"

export default function KycDaoClient(
	this: KycDaoClientInterface,
	{
		height = "100%",
		width = "100%",
		parent = document.body,
		onFail,
		onSuccess,
		iframeOptions,
		config,
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

	this.onOutsideClick = this.onOutsideClick.bind(this)
	this.messageHndlr = this.messageHndlr.bind(this)
	this.open = this.open.bind(this)
	this.close = this.close.bind(this)
	this.getParentElement = this.getParentElement.bind(this)
}

KycDaoClient.prototype.onOutsideClick = function (
	this: KycDaoClientInterface,
	event: MouseEvent
) {
	if (this.modal && !event.composedPath().includes(this.modal as EventTarget)) {
		this.close()
		if (this.onFail) {
			this.onFail("cancelled")
		}
	}
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
		this.parent.classList.add("KycDaoModalRoot")

		this.modal = document.createElement("div")
		this.modal.classList.add("KycDaoModal")
		this.modal.style.setProperty("--width", this.width)
		this.modal.style.setProperty("--height", this.height)

		const container = document.createElement("iframe")
		container.allow = "encrypted-media; camera"
		container.src = this.iframeOptions.url + "?" + params.toString()
		container.width = this.width
		container.height = this.height
		container.classList.add("KycDaoModalIFrame")

		this.modal.appendChild(container)

		this.parent.appendChild(this.modal)
		this.isOpen = true

		// The setTimeout needed because the close event handler would close the modal instantly, because even the open button click counts
		setTimeout(() => {
			window.parent.addEventListener("click", this.onOutsideClick)
			window.parent.addEventListener("message", this.messageHndlr)
		}, 0)
	}
}

KycDaoClient.prototype.close = function (this: KycDaoClientInterface) {
	if (this.isOpen) {
		if (this.modal) {
			const parentNode = this.getParentElement()

			if (parentNode) {
				parentNode.removeChild(this.modal)
			}
			window.removeEventListener("click", this.onOutsideClick)
			window.removeEventListener("message", this.messageHndlr)
			this.isOpen = false
		}
	}
}

window.KycDaoIframeClient = KycDaoClient
