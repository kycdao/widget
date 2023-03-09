import { Widget, WidgetConfig } from "./Widget"
import { ErrorPageFactory } from "@Pages/ErrorPage"
import { ErrorBoundary } from "react-error-boundary"
import { createRoot } from "react-dom/client"

export interface StandaloneClientConfig extends WidgetConfig {
	container: HTMLElement | string
}

export interface StandaloneClientHandle {
	close: () => void
}

export const open = (
	clientConfig: StandaloneClientConfig
): StandaloneClientHandle => {
	const { container, onFail, onSuccess, ...props } = clientConfig

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

	// As a side effect, unmount the widget when the user closes the modal
	const onFailWrapper = (reason?: string) => {
		if (onFail) {
			onFail(reason)
		}

		root.unmount()
	}

	const onSuccessWrapper = (data?: string) => {
		if (onSuccess) {
			onSuccess(data)
		}

		root.unmount()
	}

	root.render(
		<ErrorBoundary FallbackComponent={ErrorBoundaryFallbackComponent}>
			<Widget onFail={onFailWrapper} onSuccess={onSuccessWrapper} {...props} />
		</ErrorBoundary>
	)

	return {
		close: () => {
			root.unmount()
		},
	}
}

const StandaloneClient = {
	open,
}

export default StandaloneClient

/**
 * The KycDaoWidget is the global object that is exposed to the window – which can be accessed from Vanilla JS applications (StandaloneClient).
 */
window.KycDaoWidget = StandaloneClient
