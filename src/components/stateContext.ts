import { createContext } from "react"
import { Subject } from "rxjs/internal/Subject"

export type HeaderButtonState = "enabled" | "disabled" | "hidden"

const onNextSubject = new Subject<void>()
const onPrevSubject = new Subject<void>()
const onCloseSubject = new Subject<void>()

export const OnNext = onNextSubject.asObservable()
export const OnPrev = onPrevSubject.asObservable()
export const OnClose = onCloseSubject.asObservable()

export type Data = {
	chain?: string
	email: string
	taxResidency: string
	currentPage: number
	prevPage?: number
	nextPage?: number
	reversePaging?: boolean
	termsAccepted: boolean
	verifyingModalOpen: boolean
	prevButtonState: HeaderButtonState
	nextButtonState: HeaderButtonState
	closeButtonState: HeaderButtonState
	messageTargetOrigin?: string
	translations: { [key: string]: { [key: string]: string } }
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
}

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
}

export const reducer = (
	data: Data,
	{ payload, type }: DataChangeActions
): Data => {
	switch (type) {
		case DataActionTypes.chainChange:
			return { ...data, chain: payload }
		case DataActionTypes.emailChange:
			return { ...data, email: payload }
		case DataActionTypes.changePage:
			return {
				...data,
				nextPage: payload.next,
				prevPage: payload.prev,
				currentPage: payload.current,
			}
		case DataActionTypes.taxResidenceChange:
			return { ...data, taxResidency: payload }
		case DataActionTypes.termsAcceptedChange:
			return { ...data, termsAccepted: payload }
		case DataActionTypes.setVerifyingModalOpen:
			return { ...data, verifyingModalOpen: payload }
		case DataActionTypes.SetHeaderButtonState:
			switch (payload.button) {
				case HeaderButtons.close:
					return { ...data, closeButtonState: payload.state }
				case HeaderButtons.next:
					return { ...data, nextButtonState: payload.state }
				case HeaderButtons.prev:
					return { ...data, prevButtonState: payload.state }
				default:
					return data
			}
		case DataActionTypes.OnClickHeaderButton:
			switch (payload.button) {
				case HeaderButtons.close:
					onCloseSubject.next()
					return data
				case HeaderButtons.next:
					onNextSubject.next()
					return data
				case HeaderButtons.prev:
					onPrevSubject.next()
					return data
			}
	}
}

export const DefaultData = {
	closeButtonState: "enabled",
	currentPage: StepID.loading,
	email: "",
	taxResidency: "",
	termsAccepted: false,
	verifyingModalOpen: false,
	nextButtonState: "enabled",
	prevButtonState: "enabled",
	translations: {
		agreementStep: {
			body1: "Ha Ho’",
			body2:
				"To buy this coffee you will have to get verified and onboard with kycDAO.",
		},
	},
} as Data

export const StateContext = createContext<{
	data: Data
	dispatch: React.Dispatch<DataChangeActions>
}>({
	data: DefaultData,
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	dispatch: () => {},
})
