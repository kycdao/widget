import { Widget, WidgetConfig } from "./Widget"
import { ErrorPageFactory } from "@Pages/ErrorPage"
import { ErrorBoundary } from "react-error-boundary"
import { createRoot } from "react-dom/client"
import { BlockchainNetwork } from "@kycdao/kycdao-sdk"
import hasNearRedirected from "@Utils/hasNearRedirected"
import getEnabledNearNetwork from "@Utils/getEnabledNearNetwork"

export interface StandaloneClientOptions extends WidgetConfig {
	container: HTMLElement | string
}

export interface StandaloneClientHandle {
	open: (blockchainNetwork: BlockchainNetwork) => void
}

const open =
	(options: StandaloneClientOptions) =>
	(blockchainNetwork: BlockchainNetwork) => {
		const { container, onFail, config, onSuccess, ...props } = options

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

		// As a side effect, unmount the widget when the user closes the modal
		// todo: what about no modal?
		const onFailWrapper = (reason?: string) => {
			onFail?.()

			root.unmount()
		}

		const onSuccessWrapper = (data?: string) => {
			onSuccess?.(data)

			root.unmount()
		}

		root.render(
			<ErrorBoundary FallbackComponent={ErrorBoundaryFallbackComponent}>
				<Widget
					onFail={onFailWrapper}
					onSuccess={onSuccessWrapper}
					config={config}
					{...props}
				/>
			</ErrorBoundary>
		)

		return {
			close: () => {
				root.unmount()
			},
		}
	}

const init = (options: StandaloneClientOptions): StandaloneClientHandle => {
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

const StandaloneClient = {
	init,
}

export default StandaloneClient

/**
 * The KycDaoWidget is the global object that is exposed to the window – which can be accessed from Vanilla JS applications (StandaloneClient).
 */
window.KycDaoWidget = StandaloneClient
