import {
	defaultModalOptions,
	WidgetConfig,
	WidgetModalContainer,
} from "./Widget"
import { ErrorPageFactory } from "@Pages/ErrorPage"
import { ErrorBoundary } from "react-error-boundary"
import { createRoot } from "react-dom/client"
import {
	isOnFailMessage,
	isOnMint,
	isOnReadyMessage,
	isOnRegisterOrLogin,
	isOnSuccessMessage,
	KycDaoMessage,
} from "./types"
import qs from "qs"
import { BlockchainNetwork, KycDao } from "@kycdao/kycdao-sdk"
import hasNearRedirected from "@Utils/hasNearRedirected"
import getEnabledNearNetwork from "@Utils/getEnabledNearNetwork"
import { nearNetworkRegex } from "./StandaloneClientCommon"

export interface StandaloneIframeClientOptions extends WidgetConfig {
	container: HTMLElement | string
	url: string
}

export interface StandaloneIframeClientHandle {
	open: (blockchainNetwork: BlockchainNetwork) => void
}

// For debug purposes
window.name = "Main window"

const open =
	(options: StandaloneIframeClientOptions) =>
	(
		blockchainNetwork: BlockchainNetwork,
		options2?: StandaloneIframeClientOptions
	) => {
		const {
			container,
			url,
			modalOptions = defaultModalOptions,
			onFail,
			onReady,
			config,
			onSuccess,
			isModal = true,
		} = options2 ? options2 : options

		config.enabledBlockchainNetworks = [blockchainNetwork]

		const rootElement =
			typeof container === "string"
				? document.querySelector(container)
				: container

		if (!rootElement) {
			throw new Error(
				`There is no such element as '${container}', check your parent selector string!`
			)
		}

		const root = createRoot(rootElement)

		// todo: move this to a component
		const ErrorBoundaryFallbackComponent = ErrorPageFactory(
			window.location.origin
		)

		const params = qs.stringify(
			{
				...config,
				messageTargetOrigin: window.location.origin,
			},
			{ encode: false }
		)

		const messageHandler = (event: KycDaoMessage) => {
			if (isOnReadyMessage(event)) {
				onReady?.(event.data.data)
			} else if (isOnFailMessage(event)) {
				onFail?.(event.data.data)
			} else if (isOnSuccessMessage(event)) {
				onSuccess?.(event.data.data)
				close()
			} else if (isOnRegisterOrLogin(event)) {
				const chainNetwork = event.data.data as BlockchainNetwork

				if (nearNetworkRegex().test(chainNetwork)) {
					const config = { ...options.config }
					config.enabledBlockchainNetworks = [chainNetwork]

					KycDao.initialize(config)
						.then((result) => {
							result.kycDao.connectWallet("Near")
							result.kycDao.registerOrLogin()
						})
						.catch((error) => {
							alert(error)
						})
				}
			} else if (isOnMint(event)) {
				const chainNetwork = event.data.data.chainNetwork as BlockchainNetwork

				if (nearNetworkRegex().test(chainNetwork)) {
					const config = { ...options.config }
					config.enabledBlockchainNetworks = [chainNetwork]

					KycDao.initialize(config)
						.then((result) => {
							result.kycDao.connectWallet("Near")
							result.kycDao.registerOrLogin()
							result.kycDao.startMinting(event.data.data)
						})
						.catch((error) => {
							alert(error)
						})
				}
			}
		}

		window.top?.addEventListener("message", messageHandler, false)

		root.render(
			<ErrorBoundary FallbackComponent={ErrorBoundaryFallbackComponent}>
				<WidgetModalContainer
					width={modalOptions?.width}
					height={modalOptions.height}
					backdrop={modalOptions.backdrop}
					enabled={isModal}>
					<iframe
						title="KycDaoWidget"
						allow="encrypted-media; camera"
						src={`${url}?${params}`}
					/>
				</WidgetModalContainer>
			</ErrorBoundary>
		)

		if ("virtualKeyboard" in navigator) {
			navigator.virtualKeyboard.overlaysContent = true
		}

		// If the widget is opened in a modal, we need to prevent the user from scrolling the page
		if (isModal) {
			document.body.style.setProperty("height", "100%")
			document.body.style.setProperty("overflow", "hidden")
		}

		const close = () => {
			window.top?.removeEventListener("message", messageHandler)
			setTimeout(() => {
				root.unmount()
			}, 0)
		}

		return {
			close,
		}
	}

const init = (
	options: StandaloneIframeClientOptions
): StandaloneIframeClientHandle => {
	// if the user has been redirected from near, open the widget with the near network
	if (hasNearRedirected(window.location.search)) {
		open(options)(
			getEnabledNearNetwork(options.config.enabledBlockchainNetworks)
		)
	}

	return {
		open: open(options),
	}
}

const StandaloneIframeClient = {
	init,
}

export default StandaloneIframeClient

/**
 * The KycDaoIframeWidget is the global object that is exposed to the window – which can be accessed from Vanilla JS applications (StandaloneIframeClient).
 */
window.KycDaoIframeWidget = StandaloneIframeClient
