/// <reference path="../../../types.d.ts" />

const kycDaoConfig = {
  baseUrl: "https://staging.kycdao.xyz/api/frontend",
  enabledBlockchains: ["near-testnet"],
  enabledVerification: ["individual-kyc"],
};

window.kycDao = kycDaoSdk.init(kycDaoConfig);

/*
    TODO:
    - SDK init (allowed blockchains = [NEAR])
    - wire up scaffolding
    - setup "callback handling" for post-redirect back from NEAR wallet
*/

async function getKycDaoApiStatus() {
  const status = await window.kycDao.getServerStatus();

  const elem = document.getElementById("api-status");
  elem.innerHTML = status.apiStatus;
}

const nearApi = window.nearApi;

const config = {
  nodeUrl: "https://rpc.testnet.near.org",
  walletUrl: "https://wallet.testnet.near.org",
  helperUrl: "https://helper.testnet.near.org",
  explorerUrl: "https://explorer.testnet.near.org",
  deps: {
    keyStore: new nearApi.keyStores.BrowserLocalStorageKeyStore(),
  },
};

const main = () => {
  console.log("bootstrapping blockchain connection");

  (async () => {
    const near = await nearApi.connect(config);
    const wallet = new nearApi.WalletConnection(near);

    // 1. Check initialized API status
    document
      .getElementById("check-api-status")
      .addEventListener("click", getKycDaoApiStatus);

    // 2. web3 login (NEAR network)
    document.getElementById(
      "near-status"
    ).innerHTML = `connected to ${near.config.nodeUrl}`;

    if (!wallet.isSignedIn()) {
      document
        .getElementById("near-login")
        .addEventListener(
          "click",
          async () => await wallet.requestSignIn("app.kycdao.testnet", "kycDAO")
        );
    } else {
      const b = document.getElementById("near-login");
      b.innerHTML = `hi ${wallet.getAccountId()}`;
      b.setAttribute("disabled", "yes");
    }

    // 3. Check if wallet has kycDAO NFT (on-chain)
    // ⚠️ only use this for access control on your backend (server-side) ⚠️
    document
      .getElementById("check-status")
      .addEventListener("click", async () => {
        await kycDaoSdk.checkStatusForAddress(wallet.getAccountId())
      });

    // 4. Ask user for necessary information
    document
      .getElementById("validate-data")
      .addEventListener("click", async () => {
        const termsAccepted = document
          .getElementById("terms-accepted")
          .getAttribute("checked") === 'checked' ? true : false;
        const taxResidency = document
          .getElementById("tax-residency")
          .getAttribute("value");


        await kycDaoSdk.validateData({
          taxResidency,
          termsAccepted
        })

      });

    // 5. Start identity verification
    document
      .getElementById("start-verification")
      .addEventListener("click", async () => {
        const challenge = await kycDaoSdk.verifyWallet();

        const key = await near.keystore.getKey(
          near.wallet.account().connection.networkId,
          near.wallet.getAccountId()
        );

        /** @type {NearSignature} */
        const signature = key.sign(Buffer.from(challenge));

        await kycDaoSdk.verifyIdentity({
          signature: `ed25519:${nearApi.utils.serialize.base_encode(
            signature.signature
          )}`,
          publicKey: signature.publicKey.toString(),
        });
      });
  })();
};

document.addEventListener("DOMContentLoaded", main);
