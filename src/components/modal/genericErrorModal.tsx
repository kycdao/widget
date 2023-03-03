import { P, Policy } from "@Components/typography"
import { useCallback, useContext } from "react"
import { DataActionTypes, StateContext } from "../stateContext"
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
		data: { error },
		dispatch,
	} = useContext(StateContext)

	const { body, header } = error || { body: undefined, header: undefined }

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
					<P>{header}</P>
				</HeadlineWrapper>
				<CloseButton className={"material-icons"} onClick={onClose}>
					close
				</CloseButton>
			</ModalHeader>

			<ModalBody>
				<Policy>{body}</Policy>
			</ModalBody>
		</ModalContainer>
	)
}
