import modalClasses from "./_modal.module.scss"
import mintingModalClasses from "./_mintingModal.module.scss"
import clsx from "clsx"
import { Loading } from "@Components/loading/loading"

export const MintingModal = () => {
	return (
		<div
			className={clsx(
				modalClasses["kyc-dao-web-sdk-modal"],
				mintingModalClasses["kyc-dao-web-sdk-mintingModal"]
			)}>
			<div className={modalClasses["kyc-dao-web-sdk-header"]}>
				<i className="material-icons">error</i>
				<p>Mint authorization in progress</p>
			</div>

			<div className={modalClasses["kyc-dao-web-sdk-body"]}>
				{/* TODO: KYC-697 && KYC-701  */}
				<p className={"policy"}>
					Your kycNFT is getting ready! It may take up to a minute, please hold
					tight. Once authorized, it’s your turn to mint.
				</p>
			</div>
			<Loading />
			<h1 className={mintingModalClasses["kyc-dao-web-sdk-loading"]}>
				Loading
			</h1>
		</div>
	)
}
