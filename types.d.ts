const Blockchains = ["Ethereum", "Near"];
type Blockchain = typeof Blockchains[number];

const BlockchainNetworks = ["NearTestnet", "NearMainnet", "PolygonMumbai"];
type BlockchainNetwork = typeof BlockchainNetworks[number];

const VerificationTypes = ["KYB", "KYC"];
type VerificationType = typeof VerificationTypes[number];

interface Window {
  nearApi: any;
  kycDao: any;
}

interface KycDaoSdkConfig {
  apiKey?: string;
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
  init: (config: KycDaoSdkConfig) => Record<string, unknown>;
  getServerStatus: () => ServerStatus;
  walletHasKycNft: () => Promise<boolean>;
  walletHasKycNft: (chainAndAddress: ChainAndAddress) => Promise<boolean>;
  connectWallet(blockchain: Blockchain): Promise<void>;
  registerOrLogin(): Promise<void>;
  startVerification(verificationData: VerificationData): Promise<void>;
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
