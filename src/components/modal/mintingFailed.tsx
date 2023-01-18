import { StateContext } from "@Components/stateContext"
import { useCallback, useContext } from "react"
import { useMinting } from "@Hooks/useMinting"
import { Button } from "../button/button"
import { P, Policy } from "@Style/index"
import {
	HeaderIcon,
	HeadlineWrapper,
	ModalBody,
	ModalButtonWrapper,
	ModalContainer,
	ModalHeader,
} from "./common"

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
