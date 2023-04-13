import { KycDaoIframeClient } from "@kycdao/widget"

const iframeClient = new KycDaoIframeClient({
	parent: "#modalroot",
	iframeOptions: {
		url: "https://sdk.kycdao.xyz/iframe.html",
		messageTargetOrigin: window.origin,
	},
	config: {
		demoMode: true,
		enabledBlockchainNetworks: ["PolygonMumbai"],
		enabledVerificationTypes: ["KYC"],
		evmProvider: "ethereum",
		baseUrl: "https://staging.kycdao.xyz",
		sentryConfiguration: {
			dsn: "https://23dafecec027439b9413cd50eb22567d@o1184096.ingest.sentry.io/4504559638413313",
		},
	},
	modal: true,
})

function Iframe() {
	return (
		<div>
			<h1>Iframe integration</h1>

			<button onClick={() => iframeClient.open()}>Open modal</button>

			<div id="modalroot" />
		</div>
	)
}

export default Iframe
