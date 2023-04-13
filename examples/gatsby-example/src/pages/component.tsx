import React, { FC, useEffect, useRef, useState } from "react"
import { KycDaoWidgetConfig } from "@kycdao/widget/dist"

const ComponentPage: React.FC = () => {
	const [widgetOpen, setWidgetOpen] = useState(false)
	const Widget = useRef<FC<KycDaoWidgetConfig>>()

	useEffect(() => {
		import("@kycdao/widget").then(({ KycDaoWidget }) => {
			Widget.current = KycDaoWidget
		})
	}, [])

	return (
		<div>
			<h1>React Component integration</h1>

			<button onClick={() => setWidgetOpen(true)}>Open modal</button>

			{widgetOpen && (
				<div
					style={{
						zIndex: 10,
						width: 400,
						height: 650,
						overflow: "hidden",
						display: "block",
						margin: "auto",
						boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
						position: "relative",
					}}>
					{Widget.current && (
						<Widget.current
							onSuccess={(tx_url) => console.log(tx_url)}
							onFail={(err) => console.error(err)}
							config={{
								baseUrl: "https://staging.kycdao.xyz",
								enabledVerificationTypes: ["KYC"],
								enabledBlockchainNetworks: ["PolygonMumbai"],
								evmProvider: window.ethereum,
								sentryConfiguration: {
									dsn: "https://23dafecec027439b9413cd50eb22567d@o1184096.ingest.sentry.io/4504559638413313",
								},
							}}
						/>
					)}
				</div>
			)}
		</div>
	)
}

export default ComponentPage

export const Head = () => <title>Component example</title>
