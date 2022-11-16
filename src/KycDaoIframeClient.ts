import {
	BlockchainNetwork,
	SdkConfiguration,
	VerificationType,
} from "@kycdao/kycdao-sdk"
import { KycDaoEnvironment } from "@kycdao/kycdao-sdk/dist/types"
import "./KycDaoClient.scss"

export type KycDaoClientMessages =
	| "kycDaoCloseModal"
	| "kycDaoSuccess"
	| "kycDaoFail"

export type UrlParams = {
	[key: string]:
		| string
		| BlockchainNetwork[]
		| undefined
		| VerificationType[]
		| boolean

	apiKey?: string
	environment?: KycDaoEnvironment
	demoMode?: boolean
	baseUrl?: string
	enabledBlockchainNetworks?: BlockchainNetwork[]
	enabledVerificationTypes?: VerificationType[]
	evmProvider?: string
	url?: string
	messageTargetOrigin?: string
	width?: string
	height?: string
}

export type KycDaoClientIFrameUrlParameters = {
	width: string
	height: string
	messageTargetOrigin: string
} & SdkConfiguration

export type KycDaoClientMessage = {
	origin: string
	data: { data: string; type: KycDaoClientMessages }
}

export type KycDaoClientMessageHandler = (message: KycDaoClientMessage) => void

export type KycDaoClientInterface = {
	config: SdkConfiguration
	iframeOptions: IframeOptions
	width: string
	height: string
	isOpen: boolean
	modal?: HTMLElement
	parent: HTMLElement | string
	isSuccessful: boolean
	onFail?: (reason: string) => void
	onSuccess?: (data?: string) => void
	open: () => void
	close: () => void
	onOutsideClick: (event: MouseEvent) => void
	messageHndlr: () => KycDaoClientMessageHandler
	getParentElement: () => HTMLElement
}

export type KycDaoClientOptions = {
	width: number | string
	height: number | string
	parent: HTMLElement | string
	config: SdkConfiguration
	iframeOptions: IframeOptions
	onFail?: (reason: string) => void
	onSuccess?: (data?: string) => void
}

export type IframeOptions = {
	url?: string
	messageTargetOrigin: string
}

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
	if (!this.isOpen) {
		this.parent = this.getParentElement() || document.body

		this.parent.style.width = "100%"
		this.parent.style.height = "100%"
		this.parent.style.position = "absolute"

		this.modal = document.createElement("div")
		this.modal.classList.add("KycDaoModal")

		this.modal.style.setProperty("--width", this.width)
		this.modal.style.setProperty("--height", this.height)

		const container = document.createElement("iframe")

		const container2 = container as HTMLIFrameElement

		if (!this.iframeOptions.url) {
			throw new Error(
				"An URL is needed if you want to use an iframe! What do you want to display?"
			)
		}

		container2.allow = "encrypted-media; camera"
		container2.style.border = "border: 0px"
		container2.style.borderWidth = "0"

		const params = new URLSearchParams()
		params.set("messageTargetOrigin", this.iframeOptions.messageTargetOrigin)

		Object.entries(this.config).forEach(({ 0: key, 1: value }) => {
			if (Array.isArray(value)) {
				params.set(`${key}`, `["${value.join('","')}"]`)
			} else {
				params.set(key, value)
			}
		})
		Object.entries(this.iframeOptions).forEach(({ 0: key, 1: value }) => {
			if (Array.isArray(value)) {
				params.set(`${key}`, `["${value.join('","')}"]`)
			} else {
				params.set(key, value)
			}
		})

		container2.src = this.iframeOptions.url + "?" + params.toString()
		container2.width = this.width
		container2.height = this.height

		container.classList.add("KycDaoModalFrame")
		container.style.position = "absolute"
		container.style.inset = "0"
		container.style.overflow = "hidden"

		this.modal.appendChild(container)

		this.parent.appendChild(this.modal)
		this.isOpen = true

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
