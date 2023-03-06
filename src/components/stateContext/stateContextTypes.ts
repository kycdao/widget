import { Flow } from "./getNextStep"

export enum HeaderActionTypes {
	setNextButtonState,
	setPrevButtonState,
	setCloseButtonState,
}

export enum HeaderButtons {
	prev,
	next,
	close,
}

export enum DataActionTypes {
	SetError,
	chainChange,
	changePage,
	prevPage,
	emailChange,
	taxResidenceChange,
	termsAcceptedChange,
	SetHeaderButtonState,
	setVerifyingModalOpen,
	OnClickHeaderButton,
	setEmailConfirmed,
	nftImageChange,
	subscriptionYearsChange,
	setChainExplorerUrl,
	setMessageTargetOrigin,
	setModalMode,
	grantNameAndAddressChange,
	grantSocialSecurityNumberChange,
	setNftImageUrl,
	SetReturnUserFlow,
	SetProcessSucess,
	SetAlreadyHaveAnNftOnThisChain,
	SetNearMinted,
	GoToNextStep,
	StartFlow,
	GoToPrevStep,
	SetLoadingMessage,
	ShowModal,
}

export enum StepID {
	AgreementStep = 1,
	kycDAOMembershipStep,
	verificationStep,
	emailDiscordVerificationStep,
	taxResidenceStep,
	beginVerificationStep,
	nftArtSelection,
	finalStep,
	chainSelection,
	termsAccepted,
	loading,
	mintStep,
	subscribedStartStep,
	grantNameAndAddressStep,
	grantSocialSecurityNumberStep,
	fatalError,
	verifyAccountStep,
}

export type ErrorType = "fatal" | "modal" | "minting"

export type ModalData = {
	header: string
	body: string
	type: ModalType
	showRetry: boolean
}

export type Data = {
	error?: ErrorData
	loadingMessage: string
	flowStack: Flow[]
	stepIndices: number[]
	nftImageUrl?: string
	resetKey?: number
	imageId?: string
	chain?: string
	email: string
	taxResidency: string
	currentPage: StepID
	prevPage?: number
	nextPage?: number
	reversePaging?: boolean
	termsAccepted: boolean
	verifyingModalOpen: boolean
	currentModal: ModalType | null
	prevButtonState: HeaderButtonState
	nextButtonState: HeaderButtonState
	closeButtonState: HeaderButtonState
	messageTargetOrigin: string
	translations: { [key: string]: { [key: string]: string } }
	isEmailConfirmed: boolean
	subscriptionYears?: number
	modal?: ModalData | ModalType
	chainExplorerUrl?: string
	isModal: boolean
	grantFlowEnabled: boolean
	grantFlow: {
		name?: string
		address?: string
		socialSecurityNumber?: string
	}
	returningUserFlow: boolean
	isProcessSuccess: boolean
	alreadyHaveAnNftOnThisChain: boolean
	nearMinted: boolean
}

export type HeaderButtonState = "enabled" | "disabled" | "hidden"

export type SetVerifyingModalOpen = {
	type: DataActionTypes.setVerifyingModalOpen
	payload: boolean
}

export type ChainChangeAction = {
	type: DataActionTypes.chainChange
	payload: string
}

export type EmailChangeAction = {
	type: DataActionTypes.emailChange
	payload: string
}

export type ChangePageAction = {
	type: DataActionTypes.changePage
	payload: {
		next?: StepID
		current: StepID
		prev?: StepID
		reversePaging?: boolean
	}
}

export type TaxResidentChangeAction = {
	type: DataActionTypes.taxResidenceChange
	payload: string
}

export type TermsAcceptedChangeAction = {
	type: DataActionTypes.termsAcceptedChange
	payload: boolean
}

export type SetHeaderButtonStateAction = {
	type: DataActionTypes.SetHeaderButtonState
	payload: { state: HeaderButtonState; button: HeaderButtons }
}

export type HeaderButtonClickAction = {
	type: DataActionTypes.OnClickHeaderButton
	payload: { button: HeaderButtons }
}

export type EmailConfirmedChangeAction = {
	type: DataActionTypes.setEmailConfirmed
	payload: boolean
}

export type NftImageChangeAction = {
	type: DataActionTypes.nftImageChange
	payload: string
}

export type SetSubscriptionYearsAction = {
	type: DataActionTypes.subscriptionYearsChange
	payload: number
}

export type SetChainExplorerUrl = {
	type: DataActionTypes.setChainExplorerUrl
	payload: string
}

export type SetMessageTargetOrigin = {
	type: DataActionTypes.setMessageTargetOrigin
	payload: string
}

export type SetModalMode = {
	type: DataActionTypes.setModalMode
	payload: boolean
}

export type SetNftImageUrl = {
	type: DataActionTypes.setNftImageUrl
	payload: string
}

export type GrantNameAndAddressChange = {
	type: DataActionTypes.grantNameAndAddressChange
	payload: { name?: string; address?: string }
}

export type GrantSocialSecurityNumberChange = {
	type: DataActionTypes.grantSocialSecurityNumberChange
	payload: Data["grantFlow"]["socialSecurityNumber"]
}

export type SetReturnUserFlowChange = {
	type: DataActionTypes.SetReturnUserFlow
	payload: boolean
}

export type SetProcessSucess = {
	type: DataActionTypes.SetProcessSucess
	payload: boolean
}

export type SetAlreadyHaveAnNftOnThisChain = {
	type: DataActionTypes.SetAlreadyHaveAnNftOnThisChain
	payload: boolean
}

export type SetNearMinted = {
	type: DataActionTypes.SetNearMinted
	payload: boolean
}

export type GoToNextStep = {
	type: DataActionTypes.GoToNextStep
	payload?: never
}

export type StartFlow = {
	type: DataActionTypes.StartFlow
	payload?: never
}

export type GoToPrevStep = {
	type: DataActionTypes.GoToPrevStep
	payload?: never
}

export type ShowModal = {
	type: DataActionTypes.ShowModal
	payload?: ModalData | ModalType
}

export type SetLoadingMessage = {
	type: DataActionTypes.SetLoadingMessage
	payload: string
}

export type ErrorData = { type: ErrorType; header?: string; body?: string }

export type SetError = {
	type: DataActionTypes.SetError
	payload: ErrorData
}

export type DataChangeActions =
	| HeaderButtonClickAction
	| SetHeaderButtonStateAction
	| SetVerifyingModalOpen
	| TermsAcceptedChangeAction
	| ChainChangeAction
	| EmailChangeAction
	| ChangePageAction
	| TaxResidentChangeAction
	| EmailConfirmedChangeAction
	| NftImageChangeAction
	| SetSubscriptionYearsAction
	| SetChainExplorerUrl
	| SetMessageTargetOrigin
	| SetModalMode
	| GrantNameAndAddressChange
	| GrantSocialSecurityNumberChange
	| SetNftImageUrl
	| SetReturnUserFlowChange
	| SetProcessSucess
	| SetAlreadyHaveAnNftOnThisChain
	| SetNearMinted
	| GoToNextStep
	| StartFlow
	| GoToPrevStep
	| ShowModal
	| SetLoadingMessage
	| SetError

export type ModalType =
	| "emailVerification"
	| "minting"
	| "mintingFailed"
	| "genericError"
	| "genericInfo"
