import { useCallback, useContext } from "react"
import { useKycDao } from "@Hooks/useKycDao"
import {
	HeaderIcon,
	HeadlineWrapper,
	ModalBody,
	ModalButtonWrapper,
	ModalContainer,
	ModalHeader,
} from "./common"
import { DataActionTypes, StateContext } from "@Components/stateContext"
import { P, Policy } from "@Components/typography"
import { Button } from "@Components/button/button"
import useErrorHandler from "@Hooks/useErrorHandler"

export const EmailVerificationModal = () => {
	const {
		data: { email },
		dispatch,
	} = useContext(StateContext)

	const { handleError } = useErrorHandler()

	const kycDao = useKycDao()

	const onResend = useCallback(() => {
		kycDao?.kycDao.resendEmailConfirmationCode().catch((e) => {
			handleError("fatal", e)
		})
	}, [kycDao, handleError])

	const onChangeEmail = useCallback(() => {
		dispatch({ type: DataActionTypes.setModal, payload: null })
	}, [dispatch])

	return (
		<ModalContainer>
			<ModalHeader>
				<HeadlineWrapper>
					<HeaderIcon
						background="var(--kyc-sdk-cybergreen-35)"
						className="material-icons">
						hourglass_bottom
					</HeaderIcon>
					<P>waiting for email confirmation</P>
				</HeadlineWrapper>
			</ModalHeader>

			<ModalBody>
				<Policy>
					Please confirm your email via the magic link sent to the following
					address:
				</Policy>
				<P>{email}</P>
			</ModalBody>

			<ModalButtonWrapper>
				<Button mode="underline" onClick={onResend}>
					<i className="material-icons">refresh</i>
					<span>Resend</span>
				</Button>

				<Button mode="underline" onClick={onChangeEmail}>
					<i className="material-icons">refresh</i>
					<span>change email</span>
				</Button>
			</ModalButtonWrapper>
		</ModalContainer>
	)
}
