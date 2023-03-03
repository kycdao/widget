import {
	DataActionTypes,
	DataChangeActions,
	StateContext,
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
	messageTargetOrigin: string
) {
	const errorText = getErrorText(error)

	dispatch({
		type: DataActionTypes.ShowError,
		payload: {
			header: "An error happened",
			body: errorText,
			type: type,
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

	switch (type) {
		case "fatal":
			dispatch({
				type: DataActionTypes.setModal,
				payload: null,
			})
			dispatch({ type: DataActionTypes.GoToNextStep })
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

	console.error(errorText)
}

export default function useErrorHandler() {
	const {
		dispatch,
		data: { messageTargetOrigin },
	} = useContext(StateContext)

	return (type: "fatal" | "modal" | "minting", error: unknown) =>
		errorHandler(type, error, dispatch, messageTargetOrigin)
}
