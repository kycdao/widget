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
		<div className={modalClasses["kyc-dao-web-sdk-modal"]}>
			<div
				className={modalClasses["kyc-dao-web-sdk-header"]}
				style={{ justifyContent: "flex-start" }}>
				<i className="material-icons icon">error</i>
				<p style={{ flex: 1 }}>{errorModalHeader}</p>
				<button
					className={clsx(
						"material-icons",
						modalClasses["kyc-dao-web-sdk-close-button"]
					)}
					onClick={onClose}>
					close
				</button>
			</div>

			<div className={modalClasses["kyc-dao-web-sdk-body"]}>
				<p className={"policy"}>{errorModalBody}</p>
			</div>
		</div>
	)
}
