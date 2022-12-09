import { useCallback, useContext } from "react"
import { DataActionTypes, StateContext } from "../stateContext"

export const GenericErrorModal = () => {
	const {
		data: { errorModalHeader, errorModalBody },
		dispatch,
	} = useContext(StateContext)

	const onClose = useCallback(() => {
		dispatch({ type: DataActionTypes.setModal, payload: null })
	}, [dispatch])

	return (
		<div className="mintingFailedModal">
			<div className="header">
				<i className="material-icons">error</i>
				<p>{errorModalHeader}</p>
				<button className="material-icons close-button" onClick={onClose}>
					close
				</button>
			</div>

			<div className="body">
				<p className="policy">{errorModalBody}</p>
			</div>
		</div>
	)
}
