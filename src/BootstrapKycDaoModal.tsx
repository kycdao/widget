import { createRoot } from "react-dom/client"
import KycDaoModal from "./App"
import {
	KycDaoInitializationResult,
	SdkConfiguration,
} from "@kycdao/kycdao-sdk"
import { ErrorBoundary } from "react-error-boundary"
import {
	BlockchainNetwork,
	KycDaoEnvironment,
	VerificationType,
} from "@kycdao/kycdao-sdk/dist/types"
import { ErrorPageFactory } from "./pages"

import WalletConnectProvider from "@walletconnect/web3-provider/dist/esm"

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
	evmProvider?: "ethereum"
	messageTargetOrigin?: string
	width?: string
	height?: string
}

export function BootstrapKycDaoModal({
	parent,
	...props
}: {
	width: number | string
	height: number | string
	parent: HTMLElement | string
	config: SdkConfiguration
	isModal: boolean
	onReady?: (kycDaoSdkInstance: KycDaoInitializationResult) => void
}) {
	// TODO: add sanity checking https://kycdao.atlassian.net/browse/KYC-591

	const root = createRoot(
		typeof parent === "string"
			? (document.querySelector(parent) as HTMLElement)
			: parent
	)

	const ErrorBoundaryFallbackComponent = ErrorPageFactory(
		window.location.origin
	)

	root.render(
		<ErrorBoundary FallbackComponent={ErrorBoundaryFallbackComponent}>
			<KycDaoModal {...props} />
		</ErrorBoundary>
	)
}

export type EvmProvidersT = "ethereum" | "walletConnect"

const EvmProviders: {
	[index in EvmProvidersT]: unknown
} = {
	ethereum: window.ethereum,
	walletConnect: new WalletConnectProvider({
		rpc: {
			1: "https://rpc.ankr.com/eth",
			5: "https://rpc.ankr.com/eth_goerli",
			137: "https://rpc-mainnet.maticvigil.com/",
			80001: "https://rpc-mumbai.maticvigil.com/",
			44787: "https://alfajores-forno.celo-testnet.org",
		},
		chainId: 80001,
		//   qrcodeModalOptions: {
		//     desktopLinks: [
		//       'ledger',
		//       'zerion',
		//     ],
		//     mobileLinks: [
		//       "metamask",
		//     ],
		//   }
	}),
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
		throw new Error(
			"You need to give the messageTargetOrigin, if you want to use the page in an iframe!"
		)
	}

	if (!urlParams.baseUrl) {
		throw new Error(
			"You need to give the baseUrl, if you want to use the page in an iframe!"
		)
	}

	if (!urlParams.enabledVerificationTypes) {
		throw new Error(
			"You need to give the enabledVerificationTypes, if you want to use the page in an iframe!"
		)
	}

	if (!urlParams.enabledBlockchainNetworks) {
		throw new Error(
			"You need to give the enabledBlockchainNetworks, if you want to use the page in an iframe!"
		)
	}

	const {
		apiKey,
		baseUrl,
		demoMode,
		enabledBlockchainNetworks,
		enabledVerificationTypes,
		environment,
		height,
		messageTargetOrigin,
		width,
		evmProvider,
	} = urlParams

	const ErrorBoundaryFallbackComponent = ErrorPageFactory(messageTargetOrigin)

	root.render(
		<ErrorBoundary FallbackComponent={ErrorBoundaryFallbackComponent}>
			<KycDaoModal
				config={{
					baseUrl,
					enabledVerificationTypes,
					apiKey,
					demoMode,
					enabledBlockchainNetworks,
					environment,
					evmProvider: evmProvider ? EvmProviders[evmProvider] : undefined,
				}}
				iframeOptions={{
					messageTargetOrigin,
				}}
				height={height}
				width={width}
				isModal
			/>
		</ErrorBoundary>
	)
}
