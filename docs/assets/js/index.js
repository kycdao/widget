/// <reference path="../../../types.d.ts" />

const kycDaoConfig = {
  baseUrl: "https://staging.kycdao.xyz/api/frontend",
  enabledBlockchains: ["near-testnet"],
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

document.addEventListener("DOMContentLoaded", () => {
  console.log("bootstrapping blockchain connection");

  (async () => {
    const near = await nearApi.connect(config);
    const wallet = new nearApi.WalletConnection(near);

    const signIn = async () => {
      if (wallet.isSignedIn()) {
        throw new Error('already signed in');
      }

      await wallet.requestSignIn("app.kycdao.testnet", 'kycDAO');
    };

    document.getElementById("near-status").innerHTML = `connected to ${near.config.nodeUrl}`;

    if (!wallet.isSignedIn()) {
      document.getElementById("near-login").addEventListener("click", signIn);
    } else {
      const b = document.getElementById("near-login");
      b.innerHTML = `hi ${wallet.getAccountId()}`;
      b.setAttribute('disabled', 'yes');

      // await kycDaoSdk.checkStatusForAddress(wallet)
    }

  })();
});
