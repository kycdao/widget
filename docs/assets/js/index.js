/// <reference path="../../../types.d.ts" />

const kycDaoConfig = {
  baseUrl: "https://staging.kycdao.xyz/api/frontend",
  enbaledBlockchainNetworks: ["NearTestnet"],
  enbaledVerificationTypes: ["KYC"],
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

const main = () => {
  (async () => {
    // 1. Check initialized API status
    document
      .getElementById("check-api-status")
      .addEventListener("click", getKycDaoApiStatus);

    // 2. web3 login (NEAR network)
    // TODO move this down, it will also create kycDAO session and user
    document.getElementById(
      "near-status"
    ).innerHTML = `connected to ${kycDao.nearConfig.nodeUrl}`;

    if (
      !kycDao.chainAndAddress ||
      kycDao.chainAndAddress.blockchain !== "Near"
    ) {
      document
        .getElementById("near-login")
        .addEventListener(
          "click",
          async () => await kycDao.connectWallet("Near")
        );
    } else {
      const b = document.getElementById("near-login");
      b.innerHTML = `hi ${kycDao.chainAndAddress.address}`;
      b.setAttribute("disabled", "yes");
    }

    // 3. Check if wallet has kycDAO NFT (on-chain)
    // ⚠️ only use this for access control on your backend (server-side) ⚠️
    document
      .getElementById("check-status")
      .addEventListener("click", async () => {
        await kycDao.walletHasKycNft();
      });

    // 4. Ask user for necessary information
    document
      .getElementById("submit-verification-data")
      .addEventListener("click", async () => {
        // TODO send in data with kycDao.startVerification which will trigger the Persona flow as well
        // TODO handle backend polling after Persona + add indicator
      });

    // 5. Start identity verification
    document
      .getElementById("start-verification")
      .addEventListener("click", async () => {
        // TODO TODO send in data with kycDao.startMinting, handle polling, add indicator
      });
  })();
};

document.addEventListener("DOMContentLoaded", main);
