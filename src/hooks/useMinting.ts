import { DataActionTypes, StateContext, StepID } from "@Components/stateContext"
import { VerificationTypes } from "@kycdao/kycdao-sdk"
import { useContext } from "react"
import useErrorHandler from "./errorHandler"

import { useKycDao } from "./useKycDao"
import {
	KycDaoClientMessageTypes,
	KycDaoClientMint,
} from "../KycDaoClientCommon"

export const useMinting = () => {
	const kycDao = useKycDao()
	const state = useContext(StateContext)
	const errorHandler = useErrorHandler()

	return async function StartMinting(
		imageId: string,
		subscriptionYears?: number
	) {
		if (kycDao) {
			const {
				data: { termsAccepted, currentPage, messageTargetOrigin },
				dispatch,
			} = state

			dispatch({
				type: DataActionTypes.ShowModal,
				payload: "minting",
			})

			const mintingData = {
				disclaimerAccepted: termsAccepted || kycDao.kycDao.subscribed,
				verificationType: VerificationTypes.KYC,
				imageId,
				subscriptionYears,
			}

			if (window !== window.parent) {
				window.parent.postMessage(
					{
						type: KycDaoClientMessageTypes.kycDaoMint,
						data: mintingData,
					} as KycDaoClientMint,
					messageTargetOrigin
				)
			} else {
				try {
					const result = await kycDao.kycDao.startMinting(mintingData)

					if (result) {
						const { imageUrl, transactionUrl } = result

						dispatch({
							type: DataActionTypes.setChainExplorerUrl,
							payload: transactionUrl,
						})
						dispatch({
							type: DataActionTypes.setNftImageUrl,
							payload: imageUrl,
						})
					} else {
						throw Error("Something went wrong")
					}
					dispatch({
						type: DataActionTypes.HideModal,
					})
					dispatch({
						type: DataActionTypes.changePage,
						payload: { prev: currentPage, current: StepID.finalStep },
					})
					dispatch({
						type: DataActionTypes.SetProcessSucess,
						payload: true,
					})
				} catch (error) {
					errorHandler("minting", error)
				}
			}
		}
	}
}
