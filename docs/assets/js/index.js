/// <reference path="../../../types.d.ts" />

const kycDaoConfig = {
  baseUrl: "https://staging.kycdao.xyz/api/frontend",
  enbaledBlockchainNetworks: ["NearTestnet"],
  enbaledVerificationTypes: ["KYC"],
};

window.kycDao = kycDaoSdk.init(kycDaoConfig);

/*
    TODO:
    - nicer "callback handling" for post-redirect back from NEAR wallet
    - add handling delayed verification result (eg. KYB approval/rejection can take many days)
    - either remove types (to have a clean JS only version) or sync/use types from the SDK package
    - add minting step
*/

const getKycDaoApiStatus = async () => {
  const status = await window.kycDao.getServerStatus();

  const elem = document.getElementById("api-status");
  elem.innerHTML = status.apiStatus;
}

const setupLoginDance = (actualLoginFn) => {
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
          actualLoginFn
        );
    } else {
      const b = document.getElementById("near-login");
      b.innerHTML = `hi ${kycDao.chainAndAddress.address}`;
      b.setAttribute("disabled", "yes");
    }
}

const main = () => {
  (async () => {
    // 1. Check initialized API status
    document
      .getElementById("check-api-status")
      .addEventListener("click", getKycDaoApiStatus);

    // 2. web3 login (NEAR network)
    const web3login = () => kycDao.connectWallet("Near")
    setupLoginDance(web3login)
    
    // 3. Check if wallet has kycDAO NFT (on-chain)
    // ⚠️ only use this for access control on your backend (server-side) ⚠️
    document
      .getElementById("check-status")
      .addEventListener("click", async () => {
        await kycDao.walletHasKycNft();
      });

    // 4. Start identity verification
    document
      .getElementById("submit-verification-data")
      .addEventListener("click", async () => {
        // TODO send in data with kycDao.startVerification which will also trigger the KYC flow with the configured provider
        // TODO handle backend polling + add indicator
      });

    
    // 5. mint kycNFT
    document
      .getElementById("start-verification")
      .addEventListener("click", async () => {
        // TODO TODO send in data with kycDao.startMinting, handle polling, add indicator
      });    
  })();
};

document.addEventListener("DOMContentLoaded", main);
