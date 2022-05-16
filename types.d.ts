interface Window { nearApi: any; kycDao: any }

interface KycDaoSdkConfig {
    baseUrl: string,
    enabledBlockchains: string[]
}

interface ServerStatus {
    apiStatus: string
}

interface KycDaoSdk {
    init: (config: KycDaoSdkConfig) => {};
    getServerStatus: () => ServerStatus;
}

const kycDaoSdk: KycDaoSdk;
