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
  elem.innerHTML = `connected to ${status.apiStatus}`;
};

const residencyOptionsSetup = () => {
  const taxResidencyPicker = document.getElementById("tax-residency");

  for (const country of kycDaoSdk.COUNTRIES) {
    const option = document.createElement("option");
    option.text = country.name;
    option.value = country.iso_cca2;
    taxResidencyPicker.add(option);
  }
};

const walletChanged = new Event("walletChanged");

const updateWalletConnectionElements = () => {
  const walletStatus = document.getElementById("wallet-status");
  const nearButton = document.getElementById("near-login");
  const logoutButton = document.getElementById("wallet-logout");

  if (!kycDao.walletConnected) {
    walletStatus.innerHTML = "Not connected";

    logoutButton.setAttribute("disabled", "yes");
    logoutButton.title = "logoutButton";

    nearButton.removeAttribute("disabled");
    nearButton.title = "";
  } else {
    walletStatus.innerHTML = `${kycDao.connectedChainAndAddress.blockchain} - ${kycDao.connectedChainAndAddress.address}`;
    logoutButton.removeAttribute("disabled");
    logoutButton.title = "";

    switch (kycDao.connectedChainAndAddress.blockchain) {
      case "Near":
        nearButton.setAttribute("disabled", "yes");
        nearButton.title = "NEAR wallet already connected";
        break;
      // case "Ethereum":
    }
  }
};

const walletConnectionSetup = () => {
  document.getElementById(
    "near-status"
  ).innerHTML = `connected to ${kycDao.nearConfig.nodeUrl}`;

  const walletStatus = document.getElementById("wallet-status");
  const nearButton = document.getElementById("near-login");
  const logoutButton = document.getElementById("wallet-logout");

  nearButton.addEventListener("click", async () => {
    try {
      await kycDao.connectWallet("Near");
      document.dispatchEvent(walletChanged);
    } catch (e) {
      walletStatus.innerHTML = e;
    }
  });

  logoutButton.addEventListener("click", async () => {
    try {
      await kycDao.disconnectWallet();
      document.dispatchEvent(walletChanged);
    } catch (e) {
      walletStatus.innerHTML = e;
    }
  });

  updateWalletConnectionElements();
};

const updateKycDaoLoginElements = () => {
  const status = document.getElementById("kycdao-status");
  const button = document.getElementById("kycdao-login");

  if (!kycDao.loggedIn) {
    status.innerHTML = "Not logged in";
  } else {
    status.innerHTML = "User logged in with the connected wallet";
  }

  if (!kycDao.walletConnected) {
    button.setAttribute("disabled", "yes");
    button.title = "No wallet connected";
  } else {
    button.removeAttribute("disabled");
    button.title = "";
  }
};

const kycDaoLoginSetup = () => {
  const status = document.getElementById("kycdao-status");
  const button = document.getElementById("kycdao-login");

  button.addEventListener("click", async () => {
    try {
      await kycDao.registerOrLogin();
      status.innerHTML = "User logged in with the connected wallet";
    } catch (e) {
      status.innerHTML = e;
    }
  });

  updateKycDaoLoginElements();
};

const updateKycNftCheckElements = () => {
  const button = document.getElementById("kycnft-check");

  if (!kycDao.walletConnected) {
    button.setAttribute("disabled", "yes");
    button.title = "No wallet connected";
  }
};

const kycNftCheckSetup = () => {
  const status = document.getElementById("kycnft-status");
  const button = document.getElementById("kycnft-check");

  button.addEventListener("click", async () => {
    status.innerHTML = "Feature not implemented yet";
    /* const hasKycNft = await kycDao.walletHasKycNft();
    if (hasKycNft) {
      status.innerHTML = "Connected wallet already has a kycNFT";
    } else {
      status.innerHTML = "Connected wallet does not have a kycNFT yet";
    } */
  });

  status.innerHTML = "Not checked yet";

  updateKycNftCheckElements();
};

const updateElements = () => {
  updateWalletConnectionElements();
  updateKycDaoLoginElements();
  updateKycNftCheckElements();
};

const main = () => {
  (async () => {
    // add tax residency picker country options
    residencyOptionsSetup();

    // 1. Check initialized API status
    await getKycDaoApiStatus();
    document
      .getElementById("check-api-status")
      .addEventListener("click", getKycDaoApiStatus);

    // 2. web3 login (NEAR network)
    walletConnectionSetup();

    // 3. kycDAO login
    kycDaoLoginSetup();

    // 4. Check if wallet has kycDAO NFT (on-chain)
    // ⚠️ only use this for access control on your backend (server-side) ⚠️
    kycNftCheckSetup();

    // 5. Start identity verification
    document
      .getElementById("submit-verification-data")
      .addEventListener("click", async () => {
        // TODO send in data with kycDao.startVerification which will also trigger the KYC flow with the configured provider
        // TODO handle backend polling + add indicator
      });

    // 6. mint kycNFT
    document
      .getElementById("start-verification")
      .addEventListener("click", async () => {
        // TODO TODO send in data with kycDao.startMinting, handle polling, add indicator
      });
  })();
};

document.addEventListener("walletChanged", updateElements);
document.addEventListener("DOMContentLoaded", main);
