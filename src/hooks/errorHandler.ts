import {
	DataActionTypes,
	DataChangeActions,
	StateContext,
	StepID,
} from "@Components/stateContext"
import { KycDaoClientMessageBody } from "KycDaoClientCommon"
import { useContext } from "react"

function getErrorText(error: unknown) {
	if (typeof error === "object" && !(error instanceof Error)) {
		return JSON.stringify(error)
	} else {
		return `${error}`
	}
}

export function errorHandler(
	type: "fatal" | "modal" | "minting",
	error: unknown,
	dispatch: React.Dispatch<DataChangeActions>,
	currentPage: StepID,
	messageTargetOrigin: string
) {
	const errorText = getErrorText(error)

	dispatch({
		type: DataActionTypes.SetErrorModalText,
		payload: {
			header: "An error happened",
			body: `${errorText}`,
		},
	})

	if (/\[RejectedByUser\]/g.test(errorText)) {
		window.parent.postMessage(
			{
				type: "kycDaoCloseModal",
				data: errorText,
			} as KycDaoClientMessageBody,
			messageTargetOrigin
		)

		return
	}

	console.error(errorText)

	switch (type) {
		case "fatal":
			dispatch({
				payload: { current: StepID.fatalError, prev: currentPage },
				type: DataActionTypes.changePage,
			})
			dispatch({
				type: DataActionTypes.setModal,
				payload: null,
			})
			break
		case "minting": {
			dispatch({
				type: DataActionTypes.setModal,
				payload: "mintingFailed",
			})
			break
		}
		case "modal": {
			dispatch({
				type: DataActionTypes.setModal,
				payload: "genericError",
			})
		}
	}
}

export default function useErrorHandler() {
	const {
		dispatch,
		data: { currentPage, messageTargetOrigin },
	} = useContext(StateContext)

	return (type: "fatal" | "modal" | "minting", error: unknown) =>
		errorHandler(type, error, dispatch, currentPage, messageTargetOrigin)
}
