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
	(
		blockchainNetwork: BlockchainNetwork,
		optionsOverride?: StandaloneClientOptions
	) => {
		const { container, onFail, config, onSuccess, ...props } = optionsOverride
			? optionsOverride
			: options

		config.enabledBlockchainNetworks = [blockchainNetwork]

		const rootElement =
			typeof container === "string"
				? document.querySelector(container)
				: container

		if (!rootElement) {
			console.error(
				`There is no such element as '${container}', check your parent selector string!`
			)
			throw new Error(
				`There is no such element as '${container}', check your parent selector string!`
			)
		}

		const root = createRoot(rootElement)

		// todo: move this to a component
		const ErrorBoundaryFallbackComponent = ErrorPageFactory()

		// As a side effect, unmount the widget when the user closes the modal
		// todo: what about no modal?
		// The setTimeout looks weird, but necessary in the moment: https://github.com/facebook/react/issues/25675
		const onFailWrapper = (reason?: string) => {
			onFail?.(reason)

			setTimeout(() => {
				root.unmount()
			}, 0)
		}

		const onSuccessWrapper = (data?: string) => {
			onSuccess?.(data)

			setTimeout(() => {
				root.unmount()
			}, 0)
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
				setTimeout(() => {
					root.unmount()
				}, 0)
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
