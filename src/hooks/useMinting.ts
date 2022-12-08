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
				type: DataActionTypes.setModal,
				payload: "minting",
			})

			try {
				await kycDao.kycDao.startMinting({
					disclaimerAccepted: termsAccepted,
					verificationType: VerificationTypes.KYC,
					imageId,
				})
				dispatch({
					type: DataActionTypes.changePage,
					payload: { current: currentPage, next: StepID.finalStep },
				})
			} catch (e: unknown) {
				if (typeof e === "object") {
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
