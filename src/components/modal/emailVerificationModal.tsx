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
import { B, P, Policy } from "@Components/typography"
import { Button } from "@Components/button/button"

export const EmailVerificationModal = () => {
	const {
		data: { email },
		dispatch,
	} = useContext(StateContext)

	const kycDao = useKycDao()

	const onResend = useCallback(async () => {
		try {
			await kycDao?.kycDao.resendEmailConfirmationCode()
		} catch (e) {
			console.error(e)
		}

		//something to show, if it worked or not
	}, [kycDao])

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
					<P>Waiting your mail verification</P>
				</HeadlineWrapper>
			</ModalHeader>

			<ModalBody>
				<Policy>
					Please verify yourself through the <B>link</B> we have sent you to the
					following address:
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
