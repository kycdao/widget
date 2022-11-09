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

// don't know why this stopped working, so I do a manual polyfill

if (!window.Buffer) {
	//eslint-disable-next-line @typescript-eslint/no-explicit-any
	;(window as any).Buffer = (buffer as any).Buffer
}

// https://prod-test.kycdao.xyz

export default function BootstrapKycDaoModal({
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
	onFail?: (reason: string) => void
	onSuccess?: (data?: string) => void
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

globalThis.BootstrapKycDaoModal = BootstrapKycDaoModal
