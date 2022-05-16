interface Window {
  nearApi: any;
  kycDao: any;
}

interface KycDaoSdkConfig {
  baseUrl: string;
  enabledBlockchains: string[];
}

interface ServerStatus {
  apiStatus: string;
}

interface KycDaoSdk {
  init: (config: KycDaoSdkConfig) => Record<string, unknown>;
  getServerStatus: () => ServerStatus;
  checkStatusForAddress: (address: string) => Promise<boolean>;
  validateData: (necessaryInfo: UserInfo) => Promise<boolean>;
  verifyWallet: () => string;
  verifyIdentity: (signedWalletChallenge: SignedWalletChallenge) => void;
}

const kycDaoSdk: KycDaoSdk;

interface UserInfo {
  taxResidency: string;
  termsAccepted: boolean;
}

interface SignedWalletChallenge {
  signature: string;
  publicKey: string;
}

interface NearSignature {
  signature: Uint8Array;
  publicKey: PublicKey;
}
