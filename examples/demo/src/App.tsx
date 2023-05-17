import React, { useCallback, useEffect, useState } from "react"
import { KycDaoClient } from "@kycdao/widget"
import { BlockchainNetwork, BlockchainNetworks } from "@kycdao/kycdao-sdk"

import ethereumLogo from "assets/logos/ethereum-logo-blue.svg"
import polygonLogo from "assets/logos/polygon-logo.svg"
import celoLogo from "assets/logos/celo-logo.svg"
import baseLogo from "assets/logos/base-logo-in-blue.svg"
import arbitrumLogo from "assets/logos/arbitrum-logo.svg"
import zkLogo from "assets/logos/zksync-logo.svg"
import nearLogo from "assets/logos/near-icon-wht.svg"
import solanaLogo from "assets/logos/solana-logo.svg"


const App: React.FC = () => {
  const [client, setClient] = useState<KycDaoClient>()

  useEffect(() => {
    const newClient = new KycDaoClient({
      parent: "#modalRoot",
      modal: true,
      backdrop: true,
      config: {
        demoMode: true,
        enabledBlockchainNetworks: [
          "PolygonMumbai",
          "CeloAlfajores",
          "SolanaDevnet",
          "NearTestnet",
          "EthereumGoerli",
          "BaseGoerli",
          "ArbitrumGoerli",
          "ZKSyncGoerli",
        ],
        enabledVerificationTypes: ["KYC"],
        evmProvider: window.ethereum,
        baseUrl: "https://staging.kycdao.xyz",
      },
      onReady: (sdkInstance) => {
        // eslint-disable-next-line prefer-const
        let nftCheckInterval: NodeJS.Timer

        function writeNFT() {
          if (sdkInstance.kycDao.connectedWallet) {
            sdkInstance.kycDao
              .hasValidNft("KYC")
              .then((value) => {
                console.log(
                  `This wallet ${value ? "has" : "has not"} a valid nft.`
                )
              })
              .catch(console.error)
            clearInterval(nftCheckInterval)
          }
        }

        nftCheckInterval = setInterval(writeNFT, 1000)
      },
      onSuccess: (data) => {
        if (data) {
          const i = /Already has an nft on (.*)\./g.exec(data)

          if (i) {
            console.log(`Already has an nft on ${i[1]}.`)
          }
        }
      },
    })

    setClient(newClient)
  }, [])

  const open = useCallback(
    (selectedChain: BlockchainNetwork) => {
      client?.open(selectedChain, window.ethereum)
    },
    [client]
  )

  return (
    <>
      <div id="modalRoot"></div>
      <div id="buttonContainer">
        <div id="flexCol">
          <h1 className="centered">Select your testnet</h1>
          <div id="flexRow">
            <div id="buttonsContainer">
              <p>EVM:</p>
              <div
                className="chainSelectorButton"
                onClick={() => open(BlockchainNetworks.EthereumGoerli)}>
                <img className="chainSelectorLogo" src={ethereumLogo} alt={"Ethereum logo"}/>
                Ethereum Goerli
              </div>
              <div
                className="chainSelectorButton"
                onClick={() => open(BlockchainNetworks.PolygonMumbai)}>
                <img className="chainSelectorLogo" src={polygonLogo} alt={"Polygon logo"}/>
                Polygon Mumbai
              </div>
              <div
                className="chainSelectorButton"
                onClick={() => open(BlockchainNetworks.CeloAlfajores)}>
                <img className="chainSelectorLogo" src={celoLogo} alt={"Celo logo"}/>
                Celo Alfajores
              </div>
              <div
                className="chainSelectorButton"
                onClick={() => open(BlockchainNetworks.BaseGoerli)}>
                <img className="chainSelectorLogo" src={baseLogo} alt={"Base logo"}/>
                Base Goerli
              </div>
              <div
                className="chainSelectorButton"
                onClick={() => open(BlockchainNetworks.ArbitrumGoerli)}
              >
                <img className="chainSelectorLogo" src={arbitrumLogo} alt={"Arbitrum logo"}/>
                Arbitrum Goerli
              </div>
              <div
                className="chainSelectorButton"
                onClick={() => open(BlockchainNetworks.ZKSyncGoerli)}>
                <img className="chainSelectorLogo" src={zkLogo} alt={"zkSync logo"}/>
                zkSync Goerli
              </div>
            </div>
            <div id="buttonsContainer">
              <p>Near:</p>
              <div
                className="chainSelectorButton"
                onClick={() => open(BlockchainNetworks.NearTestnet)}>
                <img className="chainSelectorLogo" src={nearLogo} alt={"Near logo"}/>
                NEAR Testnet
              </div>
            </div>
            <div id="buttonsContainer">
              <p>Solana:</p>
              <div
                className="chainSelectorButton"
                onClick={() => open(BlockchainNetworks.SolanaDevnet)}>
                <img className="chainSelectorLogo" src={solanaLogo} alt={"Solana logo"}/>
                Solana Devnet
              </div>
            </div>
          </div>
        </div>
        <div>
          <div id="faucetContainer">
            <div className="flex-1">
              <strong>FAUCETS for testing:</strong>
              <div>
                <strong>Alfajores</strong>
                &nbsp;faucet:&nbsp;
                <a href=" https://celo.org/developers/faucet" target="_blank">
                  https://celo.org/developers/faucet
                </a>
              </div>
              <div>
                <strong>Mumbai</strong>
                &nbsp;Faucet1:&nbsp;
                <a
                  href="https://faucet.polygon.technology"
                  target="_blank"
                  rel="noreferrer">
                  https://faucet.polygon.technology
                </a>
              </div>
              <div>
                <strong>Mumbai</strong>
                &nbsp;Faucet2:&nbsp;
                <a
                  href="https://mumbaifaucet.com"
                  target="_blank"
                  rel="noreferrer">
                  https://mumbaifaucet.com
                </a>
              </div>
              <div>
                <strong>Ethereum Goerli</strong>
                &nbsp;faucet list:&nbsp;
                <a
                  href="https://faucetlink.to/goerli"
                  target="_blank"
                  rel="noreferrer">
                  https://faucetlink.to/goerli
                </a>
              </div>
              <div>
                <strong>Base Goerli</strong>
                &nbsp;faucet list:&nbsp;
                <a
                  href="https://faucet.quicknode.com/base/goerli"
                  target="_blank"
                  rel="noreferrer">
                  https://faucet.quicknode.com/base/goerli
                </a>
              </div>
              <div>
                <strong>Arbitrum Goerli</strong>
                &nbsp;faucet list:&nbsp;
                <a
                  href="https://faucet.quicknode.com/arbitrum/goerli"
                  target="_blank"
                  rel="noreferrer">
                  https://faucet.quicknode.com/arbitrum/goerli
                </a>
              </div>
              <div>
                <strong>zkSync Goerli</strong>
                &nbsp;faucet list:&nbsp;
                <a
                  href="https://goerli.portal.zksync.io/faucet"
                  target="_blank"
                  rel="noreferrer">
                  https://goerli.portal.zksync.io/faucet
                </a>
              </div>
              <div>
                <strong>Near:</strong>
                &nbsp;Test wallet has testnet tokens.
              </div>
            </div>
            <div style={{ flex: 1 }}></div>
          </div>
          <div className="centered">
            If you have any questions, ask us on&nbsp;
            <a
              target="_blank"
              href="https://discord.kycDAO.xyz"
              rel="noreferrer">
              discord.kycDAO.xyz
            </a>
            <p>
              <a
                href="https://github.com/kycdao/widget"
                target="_blank"
                rel="noreferrer">
                @kycdao/widget
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
