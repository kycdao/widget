import React, { useCallback, useEffect, useState } from "react";
import { KycDaoClient } from "@kycdao/widget";
import { BlockchainNetwork, BlockchainNetworks } from "@kycdao/kycdao-sdk";

const App: React.FC = () => {
  const [client, setClient] = useState<KycDaoClient>();

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
          "EthereumGoerli"
        ],
        enabledVerificationTypes: ["KYC"],
        evmProvider: window.ethereum,
        baseUrl: "https://staging.kycdao.xyz"
      },
      onReady: (sdkInstance) => {
        // eslint-disable-next-line prefer-const
        let nftCheckInterval: NodeJS.Timer;

        function writeNFT() {
          if (sdkInstance.kycDao.connectedWallet) {
            sdkInstance.kycDao
              .hasValidNft("KYC")
              .then((value) => {
                console.log(
                  `This wallet ${value ? "has" : "has not"} a valid nft.`
                );
              })
              .catch(console.error);
            clearInterval(nftCheckInterval);
          }
        }

        nftCheckInterval = setInterval(writeNFT, 1000);
      },
      onSuccess: (data) => {
        if (data) {
          const i = /Already has an nft on (.*)\./g.exec(data);

          if (i) {
            console.log(`Already has an nft on ${i[1]}.`);
          }
        }
      }
    });

    setClient(newClient);
  }, []);

  const open = useCallback(
    (selectedChain: BlockchainNetwork) => {
      client?.open(selectedChain, window.ethereum);
    },
    [client]
  );

  return (
    <>
      <div id="modalRoot"></div>
      <div id="buttonContainer">
        <div id="flexCol">
          <h1 className="centered">Select your chain</h1>
          <div id="flexRow">
            <div id="buttonsContainer">
              <div
                className="chainSelectorButton"
                onClick={() => open(BlockchainNetworks.CeloAlfajores)}>
                Celo Testnet (Alfajores)
              </div>
              <div
                className="chainSelectorButton"
                onClick={() => open(BlockchainNetworks.PolygonMumbai)}>
                Polygon Testnet (Mumbai)
              </div>
              <div
                className="chainSelectorButton"
                onClick={() => open(BlockchainNetworks.SolanaDevnet)}>
                Solana Devnet
              </div>
              <div
                className="chainSelectorButton"
                onClick={() => open(BlockchainNetworks.NearTestnet)}>
                NEAR Testnet
              </div>
              <div
                className="chainSelectorButton"
                onClick={() => open(BlockchainNetworks.EthereumGoerli)}>
                Ethereum Testnet (Goerli)
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
                faucet:
                <a href=" https://celo.org/developers/faucet" target="_blank">
                  https://celo.org/developers/faucet
                </a>
              </div>
              <div>
                <strong>Mumbai</strong>
                Faucet1:
                <a
                  href="https://faucet.polygon.technology"
                  target="_blank"
                  rel="noreferrer">
                  https://faucet.polygon.technology
                </a>
              </div>
              <div>
                <strong>Mumbai</strong>
                Faucet2:
                <a
                  href="https://mumbaifaucet.com"
                  target="_blank"
                  rel="noreferrer">
                  https://mumbaifaucet.com
                </a>
              </div>
              <div>
                <strong>Goerli</strong>
                faucet list:
                <a
                  href="https://faucetlink.to/goerli"
                  target="_blank"
                  rel="noreferrer">
                  https://faucetlink.to/goerli
                </a>
              </div>
              <div>
                <strong>Near:</strong>
                Test wallet has testnet tokens.
              </div>
            </div>
            <div style={{ flex: 1 }}></div>
          </div>
          <div className="centered">
            If you have any questions, ask us on
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
  );
};

export default App;