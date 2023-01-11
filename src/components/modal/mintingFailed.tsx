import { StateContext } from "@Components/stateContext"
import { useCallback, useContext } from "react"
import { useMinting } from "@Hooks/useMinting"
import { Button } from "../button/button"

import modalClasses from "./_modal.module.scss"

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
				<p>Minting failed</p>
			</div>

			<div className={modalClasses["kyc-dao-web-sdk-body"]}>
				<p className={"policy"}>
					Minting failed because of an error. Please try mint kycNFT again.
				</p>
			</div>

			<div className={modalClasses["kyc-dao-web-sdk-button-wrapper"]}>
				<Button underline centered onClick={onRetry}>
					<>
						<i className="material-icons">refresh</i>
						<span>Retry</span>
					</>
				</Button>
			</div>
		</div>
	)
}
