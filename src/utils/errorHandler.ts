import {
	DataActionTypes,
	DataChangeActions,
	StepID,
} from "@Components/stateContext"
import getErrorText from "@Utils/getErrorText"
import { KycDaoClientMessageBody } from "../KycDaoClientCommon"
import { Dispatch } from "react"

export type ErrorType = "fatal" | "modal" | "minting"

export default function errorHandler(
	type: ErrorType,
	error: unknown,
	dispatch: Dispatch<DataChangeActions>,
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
