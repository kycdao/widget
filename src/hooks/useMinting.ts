import { DataActionTypes, StateContext, StepID } from "@Components/stateContext"
import { VerificationTypes } from "@kycdao/kycdao-sdk"
import { useContext } from "react"
import useErrorHandler from "./errorHandler"

import { useKycDao } from "./useKycDao"

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
				data: { termsAccepted, currentPage },
				dispatch,
			} = state

			dispatch({
				type: DataActionTypes.setModal,
				payload: "minting",
			})

			try {
				const result = await kycDao.kycDao.startMinting({
					disclaimerAccepted: termsAccepted || kycDao.kycDao.subscribed,
					verificationType: VerificationTypes.KYC,
					imageId,
					subscriptionYears,
				})
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
					type: DataActionTypes.setModal,
					payload: null,
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
