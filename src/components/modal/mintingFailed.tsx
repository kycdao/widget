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
import { StateContext } from "@Components/stateContext"
import { P, Policy } from "@Components/typography"
import { Button } from "@Components/button/button"

export const MintingFailedModal = () => {
	const minting = useMinting()
	const {
		data: { subscriptionYears, imageId },
	} = useContext(StateContext)

	const onRetry = useCallback(() => {
		if (imageId) {
			minting(imageId, subscriptionYears)
		}
	}, [minting, subscriptionYears, imageId])

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
			</ModalHeader>

			<ModalBody>
				<Policy>
					Minting failed because of an error. Please try mint kycNFT again.
				</Policy>
			</ModalBody>

			<ModalButtonWrapper>
				<Button mode="underline" centered onClick={onRetry}>
					<i className="material-icons">refresh</i>
					<span>Retry</span>
				</Button>
			</ModalButtonWrapper>
		</ModalContainer>
	)
}
