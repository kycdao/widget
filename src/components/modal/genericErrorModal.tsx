import { useCallback, useContext } from "react"
import { DataActionTypes, StateContext } from "../stateContext"

import modalClasses from "./_modal.module.scss"
import clsx from "clsx"

export const GenericErrorModal = () => {
	const {
		data: { errorModalHeader, errorModalBody },
		dispatch,
	} = useContext(StateContext)

	const onClose = useCallback(() => {
		dispatch({ type: DataActionTypes.setModal, payload: null })
	}, [dispatch])

	return (
		<div className={modalClasses.modal}>
			<div
				className={modalClasses.header}
				style={{ justifyContent: "flex-start" }}>
				<i className="material-icons icon">error</i>
				<p style={{ flex: 1 }}>{errorModalHeader}</p>
				<button
					className={clsx("material-icons", modalClasses["close-button"])}
					onClick={onClose}>
					close
				</button>
			</div>

			<div className={modalClasses.body}>
				<p className={"policy"}>{errorModalBody}</p>
			</div>
		</div>
	)
}
