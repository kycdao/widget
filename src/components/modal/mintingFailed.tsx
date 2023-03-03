import { useCallback, useContext } from "react"
import { useMinting } from "@Hooks/useMinting"
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
import { CloseButton } from ".."

export const MintingFailedModal = () => {
	const minting = useMinting()
	const {
		data: { subscriptionYears, imageId, error },
		dispatch,
	} = useContext(StateContext)

	const { body } = error || { body: undefined }

	const onRetry = useCallback(() => {
		if (imageId) {
			minting(imageId, subscriptionYears)
		}
	}, [minting, subscriptionYears, imageId])

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
					<P>Minting failed</P>
				</HeadlineWrapper>
				<CloseButton className={"material-icons"} onClick={onClose}>
					close
				</CloseButton>
			</ModalHeader>

			<ModalBody>
				<Policy>
					Minting failed because of an error. Please try mint kycNFT again.
				</Policy>
				{body && <Policy>{body}</Policy>}
			</ModalBody>

			<ModalButtonWrapper>
				<Button mode="underline" onClick={onRetry}>
					<i className="material-icons">refresh</i>
					<span>Retry</span>
				</Button>
			</ModalButtonWrapper>
		</ModalContainer>
	)
}
