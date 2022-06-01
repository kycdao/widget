const Blockchains = ["Ethereum", "Near"];
type Blockchain = typeof Blockchains[number];

const BlockchainNetworks = ["NearTestnet", "NearMainnet", "PolygonMumbai"];
type BlockchainNetwork = typeof BlockchainNetworks[number];

const KycDaoEnvironments = ["demo", "test"];
type KycDaoEnvironment = typeof KycDaoEnvironments[number];

const VerificationTypes = ["KYB", "KYC"];
type VerificationType = typeof VerificationTypes[number];

interface Window {
  nearApi: any;
  kycDao: any;
}

interface KycDaoSdkConfig {
  apiKey?: string;
  environment: KycDaoEnvironment;
  baseUrl: string;
  enbaledBlockchainNetworks: BlockchainNetwork[];
  enbaledVerificationTypes: VerificationType[];
}

interface ServerStatus {
  apiStatus: string;
}

interface KycDaoSdk {
  connectedChainAndAddress: ChainAndAddress | undefined;
  walletConnected: boolean;
  loggedIn: boolean;
  init: (config: KycDaoSdkConfig) => Record<string, unknown>;
  getServerStatus: () => ServerStatus;
  walletHasKycNft: () => Promise<boolean>;
  walletHasKycNft: (chainAndAddress: ChainAndAddress) => Promise<boolean>;
  connectWallet(blockchain: Blockchain): Promise<void>;
  disconnectWallet(): Promise<void>;
  registerOrLogin(): Promise<void>;
  startVerification(
    verificationData: VerificationData,
    providerOptions?: VerificationProviderOptions
  ): Promise<void>;
  checkVerificationStatus(): Promise<VerificationStasusByType>;
  getNftImageOptions(): Promise<NftImage[]>;
  startMinting(mintingData: MintingData): Promise<void>;
}

const kycDaoSdk: KycDaoSdk;

interface ChainAndAddress {
  blockchain: Blockchain;
  address: string;
}

interface VerificationData {
  email: string;
  isEmailConfirmed: boolean;
  taxResidency: string;
  isLegalEntity: boolean;
  verificationType: VerificationType;
  termsAccepted: boolean;
}

interface PersonaOptions {
  onCancel?: () => void;
  onComplete?: () => void;
  onError?: (error: string) => void;
}

interface VerificationProviderOptions {
  personaOptions?: PersonaOptions;
}

interface NftImage {
  id: string; // seed
  url: string;
  name?: string;
  description?: string;
}

interface MintingData {
  disclaimerAccepted: boolean;
  nftImageId?: string;
}
