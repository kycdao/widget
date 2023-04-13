import {useState} from "react"
import {KycDaoWidget} from "@kycdao/widget"
import { BlockchainNetworks, VerificationTypes } from "@kycdao/kycdao-sdk";

function Component() {
    const [widgetOpen, setWidgetOpen] = useState(false)

    return (
        <div>
            <h1>React Component integration</h1>

            <button onClick={() => setWidgetOpen(true)}>Open modal</button>

            {widgetOpen && (
                <KycDaoWidget
                    onSuccess={(tx_url) => console.log(tx_url)}
                    onFail={(err) => console.error(err)}
                    config={{
                        baseUrl: "https://staging.kycdao.xyz",
                        enabledVerificationTypes: [VerificationTypes.KYC],
                        enabledBlockchainNetworks: [BlockchainNetworks.PolygonMumbai],
                        evmProvider: window.ethereum,
                        sentryConfiguration: {
                            dsn: "https://23dafecec027439b9413cd50eb22567d@o1184096.ingest.sentry.io/4504559638413313",
                        },
                    }}
                />
            )}
        </div>
    )
}

export default Component
