import React, { useEffect, useRef } from "react"
import { KycDaoClientInterface } from "@kycdao/widget/dist/KycDaoClientCommon"

const IframePage: React.FC = () => {
  const iframeClient = useRef<KycDaoClientInterface>()

  useEffect(() => {
    import("@kycdao/widget").then((module) => {
      iframeClient.current = new module.KycDaoIframeClient({
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
        },
      })
    })
  }, [])

  return (
    <div>
      <h1>Iframe integration</h1>

      <button onClick={() => iframeClient.current?.open()}>Open modal</button>

      <div id="modalroot" />
    </div>
  )
}

export default IframePage

export const Head = () => <title>Iframe example</title>
