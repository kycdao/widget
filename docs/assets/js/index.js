/// <reference path="../../../types.d.ts" />

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
  elem.innerHTML = `Status message: ${status.apiStatus}`;
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
const loginStatusChanged = new Event("loginStatusChanged");

const updateWalletConnectionElements = () => {
  const evmStatus = document.getElementById("evm-status");
  const nearStatus = document.getElementById("near-status");
  const walletStatus = document.getElementById("wallet-status");
  const evmButton = document.getElementById("evm-login");
  const nearButton = document.getElementById("near-login");
  const logoutButton = document.getElementById("wallet-logout");

  const evmProviderConfigured = kycDaoStatus.evmProviderConfigured;
  evmStatus.innerHTML = evmProviderConfigured
    ? "EVM provider is configured"
    : "EVM provider not configured";
  if (!evmProviderConfigured) {
    evmButton.disabled = true;
    evmButton.title = "EVM provider not configured";
  }

  const nearNetwork = kycDaoStatus.nearNetworkConnected;
  nearStatus.innerHTML = nearNetwork
    ? `Connected to ${nearNetwork}`
    : "NEAR SDK is not configured";
  if (!nearNetwork) {
    nearButton.disabled = true;
    nearButton.title = "NEAR SDK is not configured";
    logoutButton.disabled = true;
    logoutButton.title = "NEAR SDK is not configured";
  }

  if (!kycDao.walletConnected) {
    walletStatus.innerHTML = "Not connected";

    if (nearNetwork) {
      logoutButton.disabled = true;
      logoutButton.title = "NEAR wallet not connected";

      nearButton.removeAttribute("disabled");
      nearButton.title = "";
    }
  } else {
    walletStatus.innerHTML = `${kycDao.connectedWallet.blockchain} - ${kycDao.connectedWallet.blockchainNetwork} - ${kycDao.connectedWallet.address}`;

    switch (kycDao.connectedWallet.blockchain) {
      case "Near":
        nearButton.disabled = true;
        nearButton.title = "NEAR wallet already connected";

        logoutButton.removeAttribute("disabled");
        logoutButton.title = "";
        break;
      case "Ethereum":
        logoutButton.disabled = true;
        logoutButton.title = "NEAR wallet not connected";
        break;
    }
  }
};

const walletConnectionSetup = () => {
  const walletStatus = document.getElementById("wallet-status");
  const evmButton = document.getElementById("evm-login");
  const nearButton = document.getElementById("near-login");
  const logoutButton = document.getElementById("wallet-logout");

  evmButton.addEventListener("click", async () => {
    try {
      await kycDao.connectWallet("Ethereum");
      document.dispatchEvent(walletChanged);
      document.dispatchEvent(loginStatusChanged);
    } catch (e) {
      walletStatus.innerHTML = e;
    }
  });

  nearButton.addEventListener("click", async () => {
    try {
      await kycDao.connectWallet("Near");
      document.dispatchEvent(walletChanged);
      document.dispatchEvent(loginStatusChanged);
    } catch (e) {
      walletStatus.innerHTML = e;
    }
  });

  logoutButton.addEventListener("click", async () => {
    try {
      await kycDao.disconnectWallet();
      document.dispatchEvent(walletChanged);
      document.dispatchEvent(loginStatusChanged);
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
    const connectedWallet = `${kycDao.connectedWallet.blockchain} - ${kycDao.connectedWallet.address}`;
    status.innerHTML = `User logged in with wallet: ${connectedWallet}`;
  }

  if (!kycDao.walletConnected) {
    button.disabled = true;
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
      document.dispatchEvent(loginStatusChanged);
      const connectedWallet = `${kycDao.connectedWallet.blockchain} - ${kycDao.connectedWallet.address}`;
      status.innerHTML = `User logged in with wallet: ${connectedWallet}`;
    } catch (e) {
      status.innerHTML = e;
    }
  });

  updateKycDaoLoginElements();
};

const updateKycNftCheckElements = () => {
  const button = document.getElementById("kycnft-check");

  if (!kycDao.walletConnected) {
    button.disabled = true;
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

const disableFormInputs = ({ form, disable = true, ignoreIds = [] }) => {
  if (form instanceof HTMLFormElement) {
    for (const elem of form.elements) {
      if (!ignoreIds.includes(elem.id)) {
        disable ? (elem.disabled = true) : elem.removeAttribute("disabled");
      }
    }
  }
};

const updateVerificationElements = () => {
  const form = document.getElementById("verification-form");
  const status = document.getElementById("verification-status");

  if (!kycDao.loggedIn) {
    disableFormInputs({ form, ignoreIds: ["verification-status-check"] });
  } else {
    disableFormInputs({
      form,
      disable: false,
      ignoreIds: ["verification-status-check"],
    });
  }

  status.innerHTML = "Not started";
};

const pollVerificationStatus = async ({
  verificationType,
  interval = 1000,
  maxAttempts = 10,
}) => {
  if (!verificationType) {
    throw new Error(
      "pollVerificationStatus error: verificationType must be specified"
    );
  }

  let attempts = 0;

  const executePoll = async (resolve, reject) => {
    const result = await kycDao.checkVerificationStatus();
    attempts++;

    if (result[verificationType] === true) {
      return resolve(true);
    } else if (attempts === maxAttempts) {
      return resolve(false);
    } else {
      setTimeout(executePoll, interval, resolve, reject);
    }
  };

  return new Promise(executePoll);
};

let verificationTypeForCheck;

const verificationSetup = () => {
  const submitButton = document.getElementById("submit-verification-data");
  const checkButton = document.getElementById("verification-status-check");
  const status = document.getElementById("verification-status");
  const spinner = document.getElementById("verification-spinner");
  const form = document.getElementById("verification-form");

  checkButton.disabled = true;

  const checkVerificationStatus = async (verificationType) => {
    disableFormInputs({ form });
    status.innerHTML = "Verification pending confirmation, please wait";
    submitButton.innerHTML = "Start verification";
    spinner.classList.remove("hidden");

    verificationTypeForCheck = verificationType;

    const interval = 1000;
    const maxAttempts = 10;
    const gotVerified = await pollVerificationStatus({
      verificationType: verificationTypeForCheck,
      interval,
      maxAttempts,
    });

    if (gotVerified) {
      status.innerHTML = `User verification confirmed for type "${verificationTypeForCheck}"`;
    } else {
      status.innerHTML = `Could not confirm verification in ${
        (interval * maxAttempts) / 1000
      } seconds, please try again`;
      checkButton.removeAttribute("disabled");
    }
    spinner.classList.add("hidden");
    disableFormInputs({ form, disable: false });
  };

  submitButton.addEventListener("click", async () => {
    verificationTypeForCheck = undefined;
    checkButton.disabled = true;
    status.innerHTML = "Verification started";

    const verificationData = {
      email: form["email"]?.value,
      isEmailConfirmed: form["email-verified"]?.checked,
      taxResidency: form["tax-residency"]?.value,
      isLegalEntity: form["legal-entity"]?.checked,
      verificationType: form["verification-type"]?.value,
      termsAccepted: form["terms-accepted"]?.checked,
    };

    try {
      const options = {
        personaOptions: {
          onCancel: () => {
            disableFormInputs({ form, ignoreIds: [submitButton.id] });
            status.innerHTML = "Persona verification flow interrupted";
            submitButton.innerHTML = "Continue verification";
          },
          onComplete: async () =>
            await checkVerificationStatus(verificationData.verificationType),
          onError: (error) => {
            status.innerHTML = `Persona verification error: ${error}`;
            submitButton.innerHTML = "Start verification";
          },
        },
      };
      await kycDao.startVerification(verificationData, options);
    } catch (e) {
      status.innerHTML =
        typeof e === "string" ? e : e?.message || "Unknown error";
    }
  });

  checkButton.addEventListener("click", async () => {
    if (verificationTypeForCheck) {
      await checkVerificationStatus(verificationTypeForCheck);
    }
  });

  updateVerificationElements();
};

const updateMintingElements = () => {
  const form = document.getElementById("minting-form");
  const placeholder = document.getElementById("nft-image-placeholder");
  const image = document.getElementById("nft-image");

  if (!kycDao.loggedIn) {
    disableFormInputs({ form });
    image.classList.add("hidden");
    placeholder.classList.remove("hidden");
  } else {
    const url = kycDao.getNftImageUrl();
    image.setAttribute(
      "src",
      `${url}?cachebuster=${new Date().getTime().toString()}`
    );
    placeholder.classList.add("hidden");
    image.classList.remove("hidden");

    // TODO if verified
    if (true) {
      disableFormInputs({
        form,
        disable: false,
      });
    }
  }
};

const mintingOptionsSetup = () => {
  const regenerateButton = document.getElementById("regenerate-nft-image");
  const mintButton = document.getElementById("start-minting");
  const status = document.getElementById("minting-status");
  const spinner = document.getElementById("minting-spinner");
  const form = document.getElementById("minting-form");

  regenerateButton.addEventListener("click", async () => {
    await kycDao.regenerateNftImage();
    updateMintingElements();
  });

  mintButton.addEventListener("click", async () => {
    mintButton.disabled = true;
    spinner.classList.remove("hidden");
    status.innerHTML = "Minting started";

    const mintingData = {
      disclaimerAccepted: form["disclaimer-accepted"]?.checked,
    };
    try {
      await kycDao.startMinting(mintingData);
      status.innerHTML = "Minting successful";
    } catch (e) {
      status.innerHTML = e;
    }

    spinner.classList.add("hidden");
    mintButton.removeAttribute("disabled");
  });

  updateMintingElements();
};

const updateElementsOnWalletChange = () => {
  updateWalletConnectionElements();
  updateKycDaoLoginElements();
  updateKycNftCheckElements();
};

const updateElementsOnLoginStatusChange = async () => {
  updateVerificationElements();
  updateMintingElements();
};

const main = () => {
  (async () => {
    // add tax residency picker country options
    residencyOptionsSetup();

    const kycDaoConfig = {
      baseUrl: "https://staging.kycdao.xyz",
      enabledBlockchainNetworks: ["NearTestnet", "PolygonMumbai"],
      enabledVerificationTypes: ["KYC"],
      demoMode: true,
      evmProvider: window.ethereum,
    };

    const sdkStatus = document.getElementById("sdk-status");
    const sdkInitError = document.getElementById("init-error");
    const sdkInitSpinner = document.getElementById("init-spinner");
    const sdkRedirEvent = document.getElementById("redirect-event");
    try {
      const kycDaoInitResult = await kycDaoSdk.init(kycDaoConfig);
      window.kycDao = kycDaoInitResult.kycDao;
      window.kycDaoRedirectEvent = kycDaoInitResult.redirectEvent;
      window.kycDaoStatus = kycDaoInitResult.sdkStatus;
      sdkStatus.innerHTML = "Initialized";
      sdkRedirEvent.innerHTML = kycDaoRedirectEvent
        ? kycDaoRedirectEvent.toString()
        : "None";
    } catch (e) {
      sdkStatus.innerHTML = "Failed to initialize";
      sdkInitError.innerHTML = e.toString;
      sdkInitSpinner.classList.remove("hidden");
      console.error(`kycDAO SDK initialization error: ${e}`);
    }
    sdkInitSpinner.classList.add("hidden");

    // 1. Check initialized API status
    await getKycDaoApiStatus();
    document
      .getElementById("check-api-status")
      .addEventListener("click", getKycDaoApiStatus);

    // 2. web3 login
    walletConnectionSetup();

    // 3. kycDAO login
    kycDaoLoginSetup();

    // 4. Check if wallet has kycDAO NFT (on-chain)
    // ⚠️ only use this for access control on your backend (server-side) ⚠️
    kycNftCheckSetup();

    // 5. Identity verification
    verificationSetup();

    // 6. mint kycNFT
    mintingOptionsSetup();
  })();
};

document.addEventListener("walletChanged", updateElementsOnWalletChange);
document.addEventListener(
  "loginStatusChanged",
  updateElementsOnLoginStatusChange
);
document.addEventListener("DOMContentLoaded", main);
