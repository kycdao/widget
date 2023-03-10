import {
	defaultModalOptions,
	WidgetConfig,
	WidgetModalContainer,
} from "./Widget"
import { ErrorPageFactory } from "@Pages/ErrorPage"
import { ErrorBoundary } from "react-error-boundary"
import { createRoot } from "react-dom/client"
import { KycDaoEvent, KycDaoEventTypes, KycDaoOnReadyEvent } from "./types"
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

	const params = qs.stringify(config, { encode: false })

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
						scrolling="no"
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

	// todo: test this, then close should clean this up
	if (isModal) {
		document.body.style.setProperty("height", "100%")
		document.body.style.setProperty("overflow", "hidden")
	}

	const close = () => {
		window.removeEventListener(KycDaoEventTypes.SUCCESS, onSuccessHandler)
		window.removeEventListener(KycDaoEventTypes.FAIL, onFailHandler)
		window.removeEventListener(KycDaoEventTypes.READY, onReadyHandler)
		root.unmount()
	}

	const onSuccessHandler = (event: Event) => {
		onSuccess?.((event as KycDaoEvent).data)
		close()
	}

	const onReadyHandler = (event: Event) => {
		onReady?.((event as KycDaoOnReadyEvent).data)
	}

	const onFailHandler = (event: Event) => {
		onFail?.((event as KycDaoEvent).data)
		close()
	}

	window.addEventListener(KycDaoEventTypes.SUCCESS, onSuccessHandler)
	window.addEventListener(KycDaoEventTypes.FAIL, onFailHandler)
	window.addEventListener(KycDaoEventTypes.READY, onReadyHandler)

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
