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
	messageTargetOrigin?: string
	translations: { [key: string]: { [key: string]: string } }
	isEmailConfirmed: boolean
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

export type ModalType = "emailVerification" | "minting" | "mintingFailed"
