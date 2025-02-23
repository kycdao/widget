import type {
  BlockchainNetwork,
  SdkConfiguration,
  KycDaoInitializationResult,
} from "@kycdao/kycdao-sdk"
import type {
  KycDaoEnvironment,
  VerificationType,
} from "@kycdao/kycdao-sdk/dist/types"

export type KycDaoClientMessages =
  | "kycDaoCloseModal"
  | "kycDaoSuccess"
  | "kycDaoFail"

export type KycDaoClientMessageHandler = (message: KycDaoClientMessage) => void

export type KycDaoClientInterface = {
  nearAutorunEnabled?: boolean
  config: SdkConfiguration
  iframeOptions?: IframeOptions
  width: string
  height: string
  isOpen: boolean
  modal?: HTMLElement
  isModal: boolean
  parent: HTMLElement | string
  isSuccessful: boolean
  configFromUrl?: boolean
  backdrop: boolean
  onFail?: (reason?: string) => void
  onSuccess?: (data?: string) => void
  open: (
    blockchain?: BlockchainNetwork,
    ethProvider?: KycDaoClientOptions["config"]["evmProvider"]
  ) => void
  close: () => void
  messageHndlr: KycDaoClientMessageHandler
  getParentElement: () => HTMLElement
  originalParentZIndex: string | null
  onReady?: (kycDaoSdkInstance: KycDaoInitializationResult) => void
  container?: HTMLDivElement
  nearRedirectCheck: () => boolean
}

export type KycDaoClientOptions = {
  modal?: boolean
  width?: number | string
  height?: number | string
  parent?: HTMLElement | string
  config: SdkConfiguration
  configFromUrl?: boolean
  backdrop?: boolean
  iframeOptions?: IframeOptions
  nearAutorunEnabled?: boolean
  onFail?: (reason?: string) => void
  onSuccess?: (data?: string) => void
  onReady?: (kycDaoSdkInstance: KycDaoInitializationResult) => void
}

export type IframeOptions = {
  url?: string
  messageTargetOrigin: string
}

export type UrlParams = {
  [key: string]:
    | string
    | BlockchainNetwork[]
    | undefined
    | VerificationType[]
    | boolean

  apiKey?: string
  environment?: KycDaoEnvironment
  demoMode?: boolean
  baseUrl?: string
  enabledBlockchainNetworks?: BlockchainNetwork[]
  enabledVerificationTypes?: VerificationType[]
  evmProvider?: string
  url?: string
  messageTargetOrigin?: string
  width?: string
  height?: string
}

export type KycDaoClientIFrameUrlParameters = {
  width: string
  height: string
  messageTargetOrigin: string
} & SdkConfiguration

export type KycDaoClientMessageBody = {
  data?: string
  type: KycDaoClientMessages
}

export type KycDaoClientMessage = {
  origin: string
  data: KycDaoClientMessageBody
}
