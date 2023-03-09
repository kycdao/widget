import {
	DataActionTypes,
	DataChangeActions,
	StateContext,
} from "@Components/stateContext"
import {
	KycDaoClientMessageBody,
	KycDaoClientMessageTypes,
} from "../KycDaoClientCommon"
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

	if (/\[RejectedByUser\]/g.test(errorText)) {
		window.parent.postMessage(
			{
				type: KycDaoClientMessageTypes.kycDaoCloseModal,
				data: errorText,
			} as KycDaoClientMessageBody,
			messageTargetOrigin
		)

		return
	}

	switch (type) {
		case "fatal":
			dispatch({
				type: DataActionTypes.HideModal,
			})
			dispatch({ type: DataActionTypes.SetError, payload: { type: "fatal" } })
			dispatch({ type: DataActionTypes.GoToNextStep })
			break
		case "minting": {
			dispatch({
				type: DataActionTypes.ShowModal,
				payload: "mintingFailed",
			})

			dispatch({
				type: DataActionTypes.ShowModal,
				payload: {
					header: "An error happened",
					body: errorText,
					type: "mintingFailed",
					showRetry: false,
				},
			})

			break
		}
		case "modal": {
			dispatch({
				type: DataActionTypes.ShowModal,
				payload: {
					type: "genericError",
					showRetry: false,
					body: errorText,
					header: "An error happened",
				},
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
