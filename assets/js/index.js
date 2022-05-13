const kycDaoConfig = {
  baseUrl: "https://staging.kycdao.xyz/api/frontend",
};

window.kycDao = kycDaoSdk.init(kycDaoConfig);

/*
    TODO:
    - SDK init (allowed blockchains = [NEAR])
    - wire up scaffolding
    - setup "callback handling" for post-redirect back from NEAR wallet
*/

async function getKycDaoApiStatus() {
  const status = await kycDao.getServerStatus();

  const elem = document.getElementById("api-status");
  elem.innerHTML = status.apiStatus;
}
