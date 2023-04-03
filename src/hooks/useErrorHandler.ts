import {
	DataActionTypes,
	DataChangeActions,
	StateContext,
} from "@Components/stateContext"
import { useCallback, useContext } from "react"
import getErrorText from "@Utils/getErrorText"
import { OnFailCallback } from "types"

export type ErrorType = "fatal" | "modal" | "minting"

/**
 *	The generic error function. Sometimes, when the state object is out of scope of the state provider, you have to use this, like in the Widget element.
 *
 * @param dispatch The dispatch function
 * @param type The type of the error
 * @param error The error object
 * @param onFail Callback
 * @returns Void
 */

export const HandleError = (
	dispatch: React.Dispatch<DataChangeActions>,
	type: ErrorType,
	error: unknown,
	onFail?: OnFailCallback
) => {
	const errorText = getErrorText(error)

	dispatch({
		type: DataActionTypes.SetError,
		payload: {
			type: "fatal",
			header: "An error happened",
			body: `${errorText}`,
		},
	})

	if (/\[RejectedByUser\]/g.test(errorText)) {
		dispatch({
			type: DataActionTypes.GoToNextStep,
		})
		dispatch({
			type: DataActionTypes.HideModal,
		})
		return
	}

	console.error(errorText)

	switch (type) {
		case "fatal":
			dispatch({
				type: DataActionTypes.GoToNextStep,
			})
			dispatch({
				type: DataActionTypes.HideModal,
			})
			break
		case "minting": {
			dispatch({
				type: DataActionTypes.ShowModal,
				payload: "mintingFailed",
			})
			break
		}
		case "modal": {
			dispatch({
				type: DataActionTypes.ShowModal,
				payload: "genericError",
			})
		}
	}
}

export default function useErrorHandler() {
	const {
		dispatch,
		data: { onFail },
	} = useContext(StateContext)

	const handleError = useCallback(
		(type: ErrorType, error: unknown) => {
			HandleError(dispatch, type, error, onFail)
		},
		[onFail, dispatch]
	)

	return {
		handleError,
	}
}
