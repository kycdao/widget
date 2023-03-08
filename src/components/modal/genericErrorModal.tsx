import { P, Policy } from "@Components/typography"
import { useCallback, useContext } from "react"
import { DataActionTypes, StateContext } from "../stateContext"
import {
	CloseButton,
	HeaderIcon,
	HeadlineWrapper,
	ModalBody,
	ModalButtonWrapper,
	ModalContainer,
	ModalHeader,
} from "./common"
import { Button } from "@Components/button/button"
import { RestartContext } from "@Components/restartContext"

export type GenericModalProps = {
	mode: "error" | "info"
}

export const GenericModal = ({ mode }: GenericModalProps) => {
	const {
		data: { modal, currentModal },
		dispatch,
	} = useContext(StateContext)

	const { body, header, showRetry } =
		!modal || typeof modal === "string"
			? {
					body: undefined,
					header: undefined,
					showRetry: false,
			  }
			: modal

	const ResetApp = useContext(RestartContext)

	const onClose = useCallback(() => {
		dispatch({ type: DataActionTypes.HideModal })
	}, [dispatch])

	const startAgain = useCallback(() => {
		ResetApp()
	}, [ResetApp])

	return (
		<ModalContainer>
			<ModalHeader>
				<HeadlineWrapper>
					<HeaderIcon
						background={
							currentModal === "genericError"
								? "var(--kyc-sdk-red)"
								: "var(--kyc-sdk-green)"
						}
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

			{showRetry && (
				<ModalButtonWrapper>
					<Button mode="underline" onClick={startAgain}>
						<i className="material-icons">refresh</i>
						<span>Retry</span>
					</Button>
				</ModalButtonWrapper>
			)}
		</ModalContainer>
	)
}
