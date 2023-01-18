import { useCallback, useContext } from "react"
import { DataActionTypes, StateContext } from "../stateContext"

import { P, Policy } from "@Style/index"
import {
	CloseButton,
	HeaderIcon,
	HeadlineWrapper,
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
			<ModalHeader>
				<HeadlineWrapper>
					<HeaderIcon
						background="var(--kyc-sdk-red)"
						className="material-icons">
						error
					</HeaderIcon>
					<P>{errorModalHeader}</P>
				</HeadlineWrapper>
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
