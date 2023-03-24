import { createContext } from "react"
import { Subject } from "rxjs"
import { CalculateNextStep, CalculatePrevStep, MainFlow } from "./getNextStep"
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
		case DataActionTypes.Reset: {
			const { onFail, onSuccess } = data

			return { ...DefaultData, onFail, onSuccess }
		}
		case DataActionTypes.HideModal: {
			return { ...data, modal: undefined }
		}
		case DataActionTypes.GoToNextStep: {
			return CalculateNextStep(data)
		}
		case DataActionTypes.GoToPrevStep: {
			return CalculatePrevStep(data)
		}
		case DataActionTypes.ShowModal: {
			return {
				...data,
				modal: payload,
			}
		}
		case DataActionTypes.SetError: {
			return {
				...data,
				error: payload,
			}
		}
		case DataActionTypes.StartFlow: {
			return CalculateNextStep({
				...data,
				flowStack: [MainFlow],
				stepIndices: [0],
			})
		}
		case DataActionTypes.SetLoadingMessage: {
			return { ...data, loadingMessage: payload }
		}
		case DataActionTypes.SetNearMinted: {
			return { ...data, nearMinted: payload }
		}
		case DataActionTypes.SetVerified: {
			return { ...data, isVerified: payload }
		}
		case DataActionTypes.SetAlreadyHaveAnNftOnThisChain: {
			return { ...data, alreadyHaveAnNftOnThisChain: payload }
		}
		case DataActionTypes.SetProcessSucess: {
			return { ...data, isProcessSuccess: payload }
		}
		case DataActionTypes.SetReturnUserFlow: {
			return { ...data, returningUserFlow: payload }
		}
		case DataActionTypes.setModalMode:
			return { ...data, isModal: payload }
		case DataActionTypes.setMessageTargetOrigin:
			return { ...data, messageTargetOrigin: payload }
		case DataActionTypes.setEmailConfirmed:
			return { ...data, isEmailConfirmed: payload }
		case DataActionTypes.chainChange:
			return { ...data, chain: payload }
		case DataActionTypes.emailChange:
			return { ...data, email: payload }
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
		case DataActionTypes.setNftImageUrl:
			return { ...data, nftImageUrl: payload }
		case DataActionTypes.termsAcceptedChange:
			return { ...data, termsAccepted: payload }
		case DataActionTypes.setVerifyingModalOpen:
			return { ...data, verifyingModalOpen: payload }
		case DataActionTypes.nftImageChange:
			return { ...data, imageId: payload }
		case DataActionTypes.setChainExplorerUrl:
			return { ...data, chainExplorerUrl: payload }
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
				default:
					return data
			}
		case DataActionTypes.grantNameAndAddressChange:
			return { ...data, grantFlow: { ...data.grantFlow, ...payload } }
		case DataActionTypes.grantSocialSecurityNumberChange:
			return {
				...data,
				grantFlow: { ...data.grantFlow, socialSecurityNumber: payload },
			}
	}
}

export const DefaultData = {
	loadingMessage: "",
	flowStack: [MainFlow],
	stepIndices: [0],
	returningUserFlow: false,
	isProcessSuccess: false,
	closeButtonState: "enabled",
	currentPage: StepID.loading,
	email: "",
	taxResidency: "",
	termsAccepted: false,
	isVerified: false,
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
	messageTargetOrigin: "",
	isModal: false,
	grantFlow: {},
	width: 650,
	height: 400,
	grantFlowEnabled: false,
	alreadyHaveAnNftOnThisChain: false,
	nearMinted: false,
} as Data

export const StateContext = createContext<{
	data: Data
	dispatch: React.Dispatch<DataChangeActions>
}>({
	data: DefaultData,
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	dispatch: () => {},
})
