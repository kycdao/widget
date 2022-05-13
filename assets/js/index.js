const kycDaoConfig = {
  baseUrl: "https://staging.kycdao.xyz/api/frontend",
};

window.kycDao = kycDaoSdk.init(kycDaoConfig);

async function getKycDaoApiStatus() {
  const status = await kycDao.getServerStatus();

  const elem = document.getElementById("api-status");
  elem.innerHTML = status.apiStatus;
}
