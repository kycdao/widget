import modalClasses from "./_modal.module.scss"
import mintingModalClasses from "./_mintingModal.module.scss"
import clsx from "clsx"
import { Loading } from "@Components/loading/loading"

export const MintingModal = () => {
	return (
		<div className={clsx(modalClasses.modal, mintingModalClasses.mintingModal)}>
			<div className={modalClasses.header}>
				<i className="material-icons">error</i>
				<p>Mint authorization in progress</p>
			</div>

			<div className={modalClasses.body}>
				{/* TODO: KYC-697 && KYC-701  */}
				<p className={"policy"}>
					Your kycNFT is getting ready! Please open your wallet and wait for the
					dialog to confirm the minting transaction
				</p>
			</div>
			<Loading />
			<h1 className={mintingModalClasses.loading}>Loading</h1>
		</div>
	)
}
