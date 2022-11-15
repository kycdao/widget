import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./style/style.scss"
import "./index.css"
import KycDaoModal from "./App"
import { SdkConfiguration } from "@kycdao/kycdao-sdk"
import { ErrorBoundary } from "react-error-boundary"
import { ErrorPage } from "./pages/ErrorPage"
import buffer from "buffer"
import { IframeOptions } from "./KycDaoClient"
import {
	BlockchainNetwork,
	KycDaoEnvironment,
	VerificationType,
} from "@kycdao/kycdao-sdk/dist/types"

// don't know why this stopped working, so I do a manual polyfill

if (!window.Buffer) {
	//eslint-disable-next-line @typescript-eslint/no-explicit-any
	;(window as any).Buffer = (buffer as any).Buffer
}

// https://prod-test.kycdao.xyz

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
	messageTargetOrigin?: string
	width?: string
	height?: string
}

export function BootstrapKycDaoModal({
	parent,
	height,
	width,
	config,
	iframeOptions,
}: {
	width: number | string
	height: number | string
	parent: HTMLElement | string
	config: SdkConfiguration
	iframeOptions?: IframeOptions
}) {
	const root = createRoot(
		typeof parent === "string"
			? (document.querySelector(parent) as HTMLElement)
			: parent
	)

	root.render(
		<StrictMode>
			<ErrorBoundary FallbackComponent={ErrorPage}>
				<KycDaoModal
					config={config}
					iframeOptions={iframeOptions}
					height={height}
					width={width}
				/>
			</ErrorBoundary>
		</StrictMode>
	)
}

export function BootstrapIframeKycDaoModal({
	parent,
}: {
	parent: HTMLElement | string
}) {
	const root = createRoot(
		typeof parent === "string"
			? (document.querySelector(parent) as HTMLElement)
			: parent
	)

	const urlParams = [
		...new URLSearchParams(window.location.search).entries(),
	].reduce((prev, { 0: key, 1: value }) => {
		prev[key] = value.match(/\[.*\]/) ? JSON.parse(value) : value

		return prev
	}, {} as { [key: keyof UrlParams]: string }) as UrlParams

	if (!urlParams.messageTargetOrigin) {
		throw "You need to give the messageTargetOrigin, if you want to use the page in an iframe!"
	}

	if (!urlParams.baseUrl) {
		throw "You need to give the baseUrl, if you want to use the page in an iframe!"
	}

	if (!urlParams.enabledVerificationTypes) {
		throw "You need to give the enabledVerificationTypes, if you want to use the page in an iframe!"
	}

	const {
		apiKey,
		baseUrl,
		demoMode,
		enabledBlockchainNetworks,
		enabledVerificationTypes,
		environment,
		evmProvider,
		height,
		messageTargetOrigin,
		width,
	} = urlParams

	root.render(
		<StrictMode>
			<ErrorBoundary FallbackComponent={ErrorPage}>
				<KycDaoModal
					config={{
						baseUrl,
						enabledVerificationTypes,
						apiKey,
						demoMode,
						enabledBlockchainNetworks,
						environment,
						evmProvider,
					}}
					iframeOptions={{
						messageTargetOrigin,
					}}
					height={height}
					width={width}
				/>
			</ErrorBoundary>
		</StrictMode>
	)
}

globalThis.BootstrapKycDaoModal = BootstrapKycDaoModal
globalThis.BootstrapIframeKycDaoModal = BootstrapIframeKycDaoModal
