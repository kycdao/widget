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

export interface StandaloneIframeClientConfig extends WidgetConfig {
	container: HTMLElement | string
	url: string
}

export interface StandaloneIframeClientHandle {
	close: () => void
}

export const open = (
	clientConfig: StandaloneIframeClientConfig
): StandaloneIframeClientHandle => {
	const {
		container,
		url,
		config,
		modalOptions = defaultModalOptions,
		onFail,
		onReady,
		onSuccess,
		isModal,
	} = clientConfig

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

	if (isModal) {
		root.render(
			<ErrorBoundary FallbackComponent={ErrorBoundaryFallbackComponent}>
				<WidgetModalContainer
					width={modalOptions?.width}
					height={modalOptions.height}
					backdrop={modalOptions.backdrop}>
					<iframe
						title="KycDaoWidget"
						allow="encrypted-media; camera"
						src={`${url}?${params}`}
						// todo: width and height needed?
					/>
				</WidgetModalContainer>
			</ErrorBoundary>
		)
	} else {
		root.render(
			<ErrorBoundary FallbackComponent={ErrorBoundaryFallbackComponent}>
				<iframe
					title="KycDaoWidget"
					allow="encrypted-media; camera"
					src={`${url}?${params}`}
					// todo: width and height needed?
				/>
			</ErrorBoundary>
		)
	}

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
		root.unmount()
	}

	const messageHandler = (event: KycDaoMessage) => {
		if (isOnReadyMessage(event)) {
			onReady?.(event.data.data)
			close()
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

const StandaloneIframeClient = {
	open,
}

export default StandaloneIframeClient

/**
 * The KycDaoIframeWidget is the global object that is exposed to the window – which can be accessed from Vanilla JS applications (StandaloneIframeClient).
 */
window.KycDaoIframeWidget = StandaloneIframeClient
