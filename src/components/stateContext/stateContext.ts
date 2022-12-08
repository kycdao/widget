import { createContext } from "react"
import { Subject } from "rxjs"
import {
	Data,
	DataActionTypes,
	DataChangeActions,
	HeaderButtons,
	StepID,
} from "./stateContextTypes"

const onNextSubject = new Subject<void>()
const onPrevSubject = new Subject<void>()
const onCloseSubject = new Subject<void>()

export const OnNext = onNextSubject.asObservable()
export const OnPrev = onPrevSubject.asObservable()
export const OnClose = onCloseSubject.asObservable()

export const reducer = (
	data: Data,
	{ payload, type }: DataChangeActions
): Data => {
	switch (type) {
		case DataActionTypes.setEmailConfirmed:
			return { ...data, isEmailConfirmed: payload }
		case DataActionTypes.chainChange:
			return { ...data, chain: payload }
		case DataActionTypes.emailChange:
			return { ...data, email: payload }
		case DataActionTypes.setModal:
			return { ...data, currentModal: payload }
		case DataActionTypes.subscriptionYearsChange:
			return { ...data, subscriptionYears: payload }
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
		case DataActionTypes.nftImageChange:
			return { ...data, imageId: payload }
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
			body1: "",
			body2: "",
		},
	},
	currentModal: null,
	isEmailConfirmed: false,
} as Data

export const StateContext = createContext<{
	data: Data
	dispatch: React.Dispatch<DataChangeActions>
}>({
	data: DefaultData,
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	dispatch: () => {},
})
