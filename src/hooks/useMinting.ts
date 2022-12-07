import { VerificationTypes } from "@kycdao/kycdao-sdk"
import { useContext } from "react"
import {
	DataActionTypes,
	StateContext,
	StepID,
} from "../components/stateContext"
import { useKycDao } from "./useKycDao"

export const useMinting = () => {
	const kycDao = useKycDao()
	const state = useContext(StateContext)

	return async function StartMinting() {
		if (kycDao) {
			const {
				data: { termsAccepted, imageId, currentPage },
				dispatch,
			} = state

			dispatch({
				type: DataActionTypes.changePage,
				payload: { current: StepID.loading, prev: currentPage },
			})

			try {
				await kycDao.kycDao.startMinting({
					disclaimerAccepted: termsAccepted,
					verificationType: VerificationTypes.KYC,
					imageId,
				})
				dispatch({
					type: DataActionTypes.changePage,
					payload: { current: StepID.finalStep, prev: StepID.loading },
				})
			} catch (e: unknown) {
				if (typeof e === "object") {
					alert(JSON.stringify(e))
				} else {
					alert(e)
				}
				dispatch({
					type: DataActionTypes.changePage,
					payload: {
						current: StepID.mintStep, // error page vagy valami
						prev: StepID.loading,
					},
				})
			}
		}
	}
}
