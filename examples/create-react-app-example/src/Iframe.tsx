import { KycDaoIframeClient } from "@kycdao/widget"

const iframeClient = new KycDaoIframeClient({
	parent: "#modalroot",
	iframeOptions: {
		url: "https://sdk.kycdao.xyz/iframe.html",
		messageTargetOrigin: window.origin,
	},
	config: {
		enabledBlockchainNetworks: ["PolygonMumbai"],
		enabledVerificationTypes: ["KYC"],
		evmProvider: "ethereum",
		baseUrl: "https://staging.kycdao.xyz",
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
