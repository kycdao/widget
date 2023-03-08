import type {
	BlockchainNetwork,
	SdkConfiguration,
	KycDaoInitializationResult,
} from "@kycdao/kycdao-sdk"
import type {
	KycDaoEnvironment,
	VerificationType,
} from "@kycdao/kycdao-sdk/dist/types"

export type KycDaoClientMessages =
	| "kycDaoCloseModal"
	| "kycDaoSuccess"
	| "kycDaoFail"

export const errorPrefix = "Wallet callback handling error"

export const knownNearQueryParams = {
	account_id: "NearLogin",
	errorCode: "NearUserRejectedError",
	transactionHashes: "NearMint",
}

export const nearNetworkRegex = /Near*./g

export type KycDaoClientMessageHandler = (message: KycDaoClientMessage) => void

export function messageHndlr(
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

/**
 * Compile time environment variable injection by babel-plugin-transform-inline-environment-variables & webpack.DefinePlugin.
 * 	{@link https://www.npmjs.com/package/babel-plugin-transform-inline-environment-variables package/babel-plugin-transform-inline-environment-variables}
 *	{@link https://webpack.js.org/plugins/define-plugin define-plugin}
 */
export const WelcomeString = `Thank you for using ${process.env.npm_package_name} version ${process.env.npm_package_version}+${process.env.REACT_APP_GIT_HASH}`

export type KycDaoClientInterface = {
	nearAutorunEnabled?: boolean
	config: SdkConfiguration
	width: string
	height: string
	isOpen: boolean
	modal?: HTMLElement
	isModal: boolean
	parent: HTMLElement | string
	isSuccessful: boolean
	configFromUrl?: boolean
	backdrop: boolean
	onFail?: (reason?: string) => void
	onSuccess?: (data?: string) => void
	open: (
		blockchain?: BlockchainNetwork,
		ethProvider?: KycDaoClientOptions["config"]["evmProvider"]
	) => void
	close: () => void
	getParentElement: () => HTMLElement
	originalParentZIndex: string | null
	onReady?: (kycDaoSdkInstance: KycDaoInitializationResult) => void
	container?: HTMLDivElement
	messageHndlr: ({ data: { data, type } }: KycDaoClientMessage) => void
}

export function getParentElement(this: KycDaoClientInterface) {
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

export type KycDaoClientOptions = {
	modal?: boolean
	width?: number | string
	height?: number | string
	parent?: HTMLElement | string
	config: SdkConfiguration
	configFromUrl?: boolean
	backdrop?: boolean
	nearAutorunEnabled?: boolean
	onFail?: (reason?: string) => void
	onSuccess?: (data?: string) => void
	onReady?: (kycDaoSdkInstance: KycDaoInitializationResult) => void
}

export type IframeOptions = {
	url?: string
	messageTargetOrigin: string
}

export function nearRedirectCheck() {
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
		const [match] = matches
		const [key] = match
		const event = knownNearQueryParams[key as keyof typeof knownNearQueryParams]

		if (event.startsWith("Near")) {
			return true
		}
	}

	return false
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

export type KycDaoClientMessageBody = {
	data?: string
	type: KycDaoClientMessages
}

export type KycDaoClientMessage = {
	origin: string
	data: KycDaoClientMessageBody
}
