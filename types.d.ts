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
  enabledBlockchainNetworks: BlockchainNetwork[];
  enabledVerificationTypes: VerificationType[];
}

interface ServerStatus {
  apiStatus: string;
}

interface KycDao {
  connectedWallet: ChainAndAddress | undefined;
  walletConnected: boolean;
  loggedIn: boolean;
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
  getNftImageUrl(): string;
  regenerateNftImage(): Promise<void>;
  startMinting(mintingData: MintingData): Promise<void>;
}

type WalletRedirectEvent = "NearLogin" | "NearMint" | "NearUserRejectedError";

interface KycDaoInitializationResult {
  kycDao: KycDao;
  walletRedirectEvent?: WalletRedirectEvent;
}

interface KycDaoSdk {
  init: (config: KycDaoSdkConfig) => Promise<KycDaoInitializationResult>;
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

interface MintingData {
  disclaimerAccepted: boolean;
}
