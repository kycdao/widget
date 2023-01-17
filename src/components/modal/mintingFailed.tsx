import { StateContext } from "@Components/stateContext"
import { useCallback, useContext } from "react"
import { useMinting } from "@Hooks/useMinting"
import { Button } from "../button/button"

import modalClasses from "./_modal.module.scss"
import { P, Policy } from "@Style/index"

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
		<div className={modalClasses["kyc-dao-web-sdk-modal"]}>
			<div className={modalClasses["kyc-dao-web-sdk-header"]}>
				<i className="material-icons">error</i>
				<P>Minting failed</P>
			</div>

			<div className={modalClasses["kyc-dao-web-sdk-body"]}>
				<Policy>
					Minting failed because of an error. Please try mint kycNFT again.
				</Policy>
			</div>

			<div className={modalClasses["kyc-dao-web-sdk-button-wrapper"]}>
				<Button mode="underline" centered onClick={onRetry}>
					<i className="material-icons">refresh</i>
					<span>Retry</span>
				</Button>
			</div>
		</div>
	)
}
