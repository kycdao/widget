import { DataActionTypes, StateContext, StepID } from "@Components/stateContext"
import { VerificationTypes } from "@kycdao/kycdao-sdk"
import { useContext } from "react"

import { useKycDao } from "./useKycDao"

export const useMinting = () => {
	const kycDao = useKycDao()
	const state = useContext(StateContext)

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
				dispatch({
					type: DataActionTypes.setModal,
					payload: null,
				})
				dispatch({
					type: DataActionTypes.changePage,
					payload: { prev: currentPage, current: StepID.finalStep },
				})
				if (result) {
					dispatch({
						type: DataActionTypes.setChainExplorerUrl,
						payload: result.transactionUrl,
					})
				}
			} catch (e: unknown) {
				if (typeof e === "object" && !(e instanceof Error)) {
					console.error(JSON.stringify(e))
				} else {
					console.error(e)
				}
				dispatch({
					type: DataActionTypes.setModal,
					payload: "mintingFailed",
				})
			}
		}
	}
}
