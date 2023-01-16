import modalClasses from "./_modal.module.scss"
import mintingModalClasses from "./_mintingModal.module.scss"
import clsx from "clsx"
import { Loading } from "@Components/loading/loading"
import { H1, P, Policy } from "@Style/index"

export const MintingModal = () => {
	return (
		<div
			className={clsx(
				modalClasses["kyc-dao-web-sdk-modal"],
				mintingModalClasses["kyc-dao-web-sdk-mintingModal"]
			)}>
			<div className={modalClasses["kyc-dao-web-sdk-header"]}>
				<i className="material-icons">error</i>
				<P>Mint authorization in progress</P>
			</div>

			<div className={modalClasses["kyc-dao-web-sdk-body"]}>
				{/* TODO: KYC-697 && KYC-701  */}
				<Policy>
					Your kycNFT is getting ready! It may take up to a minute, please hold
					tight. Once authorized, it’s your turn to mint.
				</Policy>
			</div>
			<Loading />
			<H1 className={mintingModalClasses["kyc-dao-web-sdk-loading"]}>
				Loading
			</H1>
		</div>
	)
}
