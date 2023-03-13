import {
	BlockchainNetwork,
	SdkConfiguration,
	KycDaoInitializationResult,
	KycDao,
} from "@kycdao/kycdao-sdk"
import type {
	KycDaoEnvironment,
	MintingData,
	VerificationType,
} from "@kycdao/kycdao-sdk/dist/types"

export enum KycDaoClientMessageTypes {
	"kycDaoCloseModal",
	"kycDaoSuccess",
	"kycDaoFail",
	"kycDaoCancelled",
	"kycDaoRegisterOrLogin",
	"kycDaoMint",
}

export const errorPrefix = "Wallet callback handling error"

export const knownNearQueryParams = {
	account_id: "NearLogin",
	errorCode: "NearUserRejectedError",
	transactionHashes: "NearMint",
}

export const nearNetworkRegex = /.*Near*./g

export type KycDaoClientMessageHandler = (message: KycDaoClientMessage) => void

export function messageHndlr(
	this: KycDaoClientInterface,
	{ data: { type, data }, origin }: KycDaoClientMessage
) {
	if (origin === window.location.origin)
		switch (type) {
			case KycDaoClientMessageTypes.kycDaoCancelled:
			case KycDaoClientMessageTypes.kycDaoCloseModal:
				this.onFail?.("cancelled")

				this.close()
				return
			case KycDaoClientMessageTypes.kycDaoSuccess:
				this.isSuccessful = true
				this.onSuccess?.(data as string)

				this.close()
				return
			case KycDaoClientMessageTypes.kycDaoFail: {
				this.onFail?.(data as string)

				return
			}
			case KycDaoClientMessageTypes.kycDaoMint: {
				const mintingData = data as MintingData

				KycDao.initialize(this.config)
					.then((result) => {
						result.kycDao.connectWallet("Near")
						result.kycDao.registerOrLogin()
						result.kycDao.startMinting(mintingData)
					})
					.catch((error) => {
						alert(error)
					})

				return
			}
			case KycDaoClientMessageTypes.kycDaoRegisterOrLogin: {
				const chainNetwork = (data as KycDaoClientRegisterOrLogin["data"])
					?.chainNetwork
				if (chainNetwork) {
					const config = { ...this.config }
					config.enabledBlockchainNetworks = chainNetwork

					KycDao.initialize(config)
						.then((result) => {
							result.kycDao.connectWallet("Near")
							result.kycDao.registerOrLogin()
						})
						.catch((error) => {
							alert(error)
						})
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
	onFail?: (reason: string) => void
	onSuccess?: (data: string) => void
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
	type: KycDaoClientMessageTypes
}

export type KycDaoClientRegisterOrLogin = {
	data?: { chainNetwork: SdkConfiguration["enabledBlockchainNetworks"] }
	type: KycDaoClientMessageTypes
}

export type KycDaoClientMint = {
	data: MintingData
	type: KycDaoClientMessageTypes.kycDaoMint
}

export type KycDaoClientSuccess = {
	data: string
	type: KycDaoClientMessageTypes.kycDaoSuccess
}

export type KycDaoClientFail = {
	data: KycDaoClientFail
	type: KycDaoClientMessageTypes.kycDaoFail
}

export type KycDaoClientMessage = {
	origin: string
	data:
		| KycDaoClientMessageBody
		| KycDaoClientRegisterOrLogin
		| KycDaoClientMint
		| KycDaoClientSuccess
		| KycDaoClientFail
}

export type KycDaoClientMessages = KycDaoClientMessage
