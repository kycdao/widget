import { useCallback, useContext } from "react"
import { DataActionTypes, StateContext } from "../stateContext"

import modalClasses from "./_modal.module.scss"
import clsx from "clsx"
import { P, Policy } from "@Style/index"

export const GenericErrorModal = () => {
	const {
		data: { errorModalHeader, errorModalBody },
		dispatch,
	} = useContext(StateContext)

	const onClose = useCallback(() => {
		dispatch({ type: DataActionTypes.setModal, payload: null })
	}, [dispatch])

	return (
		<div className={modalClasses["kyc-dao-web-sdk-modal"]}>
			<div
				className={modalClasses["kyc-dao-web-sdk-header"]}
				style={{ justifyContent: "flex-start" }}>
				<i className="material-icons icon">error</i>
				<P style={{ flex: 1 }}>{errorModalHeader}</P>
				<button
					id={modalClasses["kyc-dao-web-sdk-close-button"]}
					className={clsx("material-icons")}
					onClick={onClose}>
					close
				</button>
			</div>

			<div className={modalClasses["kyc-dao-web-sdk-body"]}>
				<Policy>{errorModalBody}</Policy>
			</div>
		</div>
	)
}
