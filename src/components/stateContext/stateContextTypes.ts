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
	chainChange,
	changePage,
	prevPage,
	emailChange,
	taxResidenceChange,
	termsAcceptedChange,
	SetHeaderButtonState,
	setVerifyingModalOpen,
	OnClickHeaderButton,
	setModal,
	setEmailConfirmed,
	nftImageChange,
	subscriptionYearsChange,
	SetErrorModalText,
	setChainExplorerUrl,
	setMessageTargetOrigin,
	setModalMode,
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
}

export type Data = {
	imageId?: string
	chain?: string
	email: string
	taxResidency: string
	currentPage: number
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
	errorModalHeader?: string
	errorModalBody?: string
	chainExplorerUrl?: string
	isModal: boolean
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

export type SetModalAction = {
	type: DataActionTypes.setModal
	payload: ModalType | null
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

export type SetErrorModalTextAction = {
	type: DataActionTypes.SetErrorModalText
	payload: { header: string; body: string }
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

export type DataChangeActions =
	| HeaderButtonClickAction
	| SetHeaderButtonStateAction
	| SetHeaderButtonStateAction
	| SetVerifyingModalOpen
	| TermsAcceptedChangeAction
	| ChainChangeAction
	| EmailChangeAction
	| ChangePageAction
	| TaxResidentChangeAction
	| SetModalAction
	| EmailConfirmedChangeAction
	| NftImageChangeAction
	| SetSubscriptionYearsAction
	| SetErrorModalTextAction
	| SetChainExplorerUrl
	| SetMessageTargetOrigin
	| SetModalMode

export type ModalType =
	| "emailVerification"
	| "minting"
	| "mintingFailed"
	| "genericError"
