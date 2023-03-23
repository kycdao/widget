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
	isOnReadyMessage,
	isOnSuccessMessage,
	KycDaoMessage,
} from "./types"
import qs from "qs"
import { BlockchainNetwork } from "@kycdao/kycdao-sdk"
import hasNearRedirected from "@Utils/hasNearRedirected"
import getEnabledNearNetwork from "@Utils/getEnabledNearNetwork"

export interface StandaloneIframeClientOptions extends WidgetConfig {
	container: HTMLElement | string
	url: string
}

export interface StandaloneIframeClientHandle {
	open: (blockchainNetwork: BlockchainNetwork) => void
}

const open =
	(options: StandaloneIframeClientOptions) =>
	(blockchainNetwork: BlockchainNetwork) => {
		const {
			container,
			url,
			modalOptions = defaultModalOptions,
			onFail,
			onReady,
			config,
			onSuccess,
			isModal = true,
		} = options

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

		console.log(`${url}?${params}`)

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
			window.removeEventListener("message", messageHandler)
			setTimeout(() => {
				console.log("unmount")
				root.unmount()
			}, 0)
		}

		const messageHandler = (event: KycDaoMessage) => {
			if (isOnReadyMessage(event)) {
				onReady?.(event.data.data)
			}

			if (isOnFailMessage(event)) {
				onFail?.(event.data.data)
				close()
			}

			if (isOnSuccessMessage(event)) {
				onSuccess?.(event.data.data)
				close()
			}
		}

		window.addEventListener("message", messageHandler, false)

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
