import { BlockchainNetwork, SdkConfiguration } from "@kycdao/kycdao-sdk"
import {
	KycDaoEnvironment,
	VerificationType,
} from "@kycdao/kycdao-sdk/dist/types"

export type KycDaoClientMessages =
	| "kycDaoCloseModal"
	| "kycDaoSuccess"
	| "kycDaoFail"

export type KycDaoClientMessageHandler = (message: KycDaoClientMessage) => void

export type KycDaoClientInterface = {
	config: SdkConfiguration
	iframeOptions?: IframeOptions
	width: string
	height: string
	isOpen: boolean
	modal: HTMLElement
	isModal: boolean
	parent: HTMLElement | string
	isSuccessful: boolean
	configFromUrl: boolean
	backdrop: boolean
	onFail?: (reason: string) => void
	onSuccess?: (data?: string) => void
	open: () => void
	close: () => void
	onOutsideClick: (event: MouseEvent) => void
	messageHndlr: () => KycDaoClientMessageHandler
	getParentElement: () => HTMLElement
	originalBodyHeight: string
	originalBodyOverflow: string
}

export type KycDaoClientOptions = {
	modal?: boolean
	width?: number | string
	height?: number | string
	parent: HTMLElement | string
	config: SdkConfiguration
	configFromUrl: boolean
	backdrop?: boolean
	iframeOptions?: IframeOptions
	onFail?: (reason: string) => void
	onSuccess?: (data?: string) => void
}

export type IframeOptions = {
	url?: string
	messageTargetOrigin: string
}

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
