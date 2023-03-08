import { StateContext } from "@Components/stateContext"
import { useCallback, useContext } from "react"
import errorHandler, { ErrorType } from "@Utils/errorHandler"

export default function useErrorHandler() {
	const {
		dispatch,
		data: { currentPage, messageTargetOrigin },
	} = useContext(StateContext)

	const handleError = useCallback(
		(type: ErrorType, error: unknown) => {
			return errorHandler(
				type,
				error,
				dispatch,
				currentPage,
				messageTargetOrigin
			)
		},
		[currentPage, dispatch, messageTargetOrigin]
	)

	return {
		handleError,
	}
}
