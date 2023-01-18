import { useCallback, useContext } from "react"
import { DataActionTypes, StateContext } from "../stateContext"

import { P, Policy } from "@Style/index"
import {
	CloseButton,
	HeaderIcon,
	ModalBody,
	ModalContainer,
	ModalHeader,
} from "./common"

export const GenericErrorModal = () => {
	const {
		data: { errorModalHeader, errorModalBody },
		dispatch,
	} = useContext(StateContext)

	const onClose = useCallback(() => {
		dispatch({ type: DataActionTypes.setModal, payload: null })
	}, [dispatch])

	return (
		<ModalContainer>
			<ModalHeader style={{ justifyContent: "flex-start" }}>
				<HeaderIcon background="var(--kyc-sdk-red)" className="material-icons">
					error
				</HeaderIcon>
				<P style={{ flex: 1 }}>{errorModalHeader}</P>
				<CloseButton className={"material-icons"} onClick={onClose}>
					close
				</CloseButton>
			</ModalHeader>

			<ModalBody>
				<Policy>{errorModalBody}</Policy>
			</ModalBody>
		</ModalContainer>
	)
}
