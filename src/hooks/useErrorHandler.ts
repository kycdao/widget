import { DataActionTypes, StateContext, StepID } from "@Components/stateContext"
import { useCallback, useContext } from "react"
import getErrorText from "@Utils/getErrorText"

export type ErrorType = "fatal" | "modal" | "minting"

export default function useErrorHandler() {
	const {
		dispatch,
		data: { currentPage, onFail },
	} = useContext(StateContext)

	const handleError = useCallback(
		(type: ErrorType, error: unknown) => {
			const errorText = getErrorText(error)

			dispatch({
				type: DataActionTypes.SetErrorModalText,
				payload: {
					header: "An error happened",
					body: `${errorText}`,
				},
			})

			if (/\[RejectedByUser\]/g.test(errorText)) {
				onFail?.(errorText)
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
		},
		[currentPage, dispatch, onFail]
	)

	return {
		handleError,
	}
}
