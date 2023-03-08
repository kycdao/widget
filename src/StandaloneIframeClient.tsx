import {
	defaultModalOptions,
	WidgetConfig,
	WidgetModalContainer,
} from "./Widget"
import { ErrorPageFactory } from "@Pages/ErrorPage"
import { ErrorBoundary } from "react-error-boundary"
import { createRoot } from "react-dom/client"
import { KycDaoEvent, KycDaoOnReadyEvent } from "./types"

export interface StandaloneIframeClientConfig extends WidgetConfig {
	container: HTMLElement | string
	url: string
}

export interface StandaloneIframeClientHandle {
	close: () => void
}

const addParams = (params: URLSearchParams, obj: Record<string, any>): void => {
	for (const [key, value] of Object.entries(obj)) {
		params.set(key, Array.isArray(value) ? `["${value.join('","')}"]` : value)
	}
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

	const params = new URLSearchParams()
	// unpack the config object into the URL params
	addParams(params, config)

	root.render(
		<ErrorBoundary FallbackComponent={ErrorBoundaryFallbackComponent}>
			<WidgetModalContainer
				width={modalOptions?.width}
				height={modalOptions.height}
				backdrop={modalOptions.backdrop}>
				<iframe
					title="KycDaoWidget"
					allow="encrypted-media; camera"
					src={`${url}?${params.toString()}`}
					// todo: width and height needed?
				/>
			</WidgetModalContainer>
		</ErrorBoundary>
	)

	if ("virtualKeyboard" in navigator) {
		navigator.virtualKeyboard.overlaysContent = true
	}

	// todo: test this, then close should clean this up
	if (isModal) {
		document.body.style.setProperty("height", "100%")
		document.body.style.setProperty("overflow", "hidden")
	}

	window.addEventListener("KycDaoIframeWidgetOnSuccess", (event) => {
		onSuccess?.((event as KycDaoEvent).data)
		root.unmount()
	})

	window.addEventListener("KycDaoIframeWidgetOnFail", (event) => {
		onFail?.((event as KycDaoEvent).data)
		root.unmount()
	})

	window.addEventListener("KycDaoIframeWidgetOnReady", (event) => {
		onReady?.((event as KycDaoOnReadyEvent).data)
		root.unmount()
	})

	return {
		close: () => {
			root.unmount()
		},
	}
}

/**
 * The KycDaoIframeWidget is the global object that is exposed to the window – which can be accessed from Vanilla JS applications (StandaloneClient).
 */
window.KycDaoIframeWidget = {
	open,
}
