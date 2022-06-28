const Blockchains = {
  Ethereum: 'Ethereum',
  Near: 'Near',
} as const;
type Blockchain = keyof typeof Blockchains;

const BlockchainNetworks = {
  NearTestnet: 'NearTestnet',
  NearMainnet: 'NearMainnet',
  PolygonMumbai: 'PolygonMumbai',
} as const;
type BlockchainNetwork = keyof typeof BlockchainNetworks;

const KycDaoEnvironments = {
  demo: 'demo',
  test: 'test',
} as const;
type KycDaoEnvironment = keyof typeof KycDaoEnvironments;

const VerificationTypes = {
  Accreditation: 'Accreditation',
  KYC: 'KYC',
} as const;
type VerificationType = keyof typeof VerificationTypes;

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
  serverBaseUrl: string;
  apiStatus: string;
  isOk: boolean;
}

interface KycDao {
  connectedWallet: ChainAndAddress | undefined;
  walletConnected: boolean;
  loggedIn: boolean;
  getServerStatus: () => ServerStatus;
  walletHasKycNft(): Promise<boolean>;
  walletHasKycNft(chainAndAddress: ChainAndAddress): Promise<boolean>;
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

type VerificationStasusByType = Partial<Record<VerificationType, boolean>>;

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
