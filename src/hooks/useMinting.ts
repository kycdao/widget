import { VerificationTypes } from "@kycdao/kycdao-sdk"
import { useContext } from "react"
import { DataActionTypes, StateContext } from "../components/stateContext"
import { useKycDao } from "./useKycDao"

export const useMinting = () => {
	const kycDao = useKycDao()
	const state = useContext(StateContext)

	return async function StartMinting() {
		if (kycDao) {
			const {
				data: { termsAccepted, imageId },
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
					type: DataActionTypes.setModal,
					payload: "mintingFailed",
				})
			} catch (e: unknown) {
				if (typeof e === "object") {
					alert(JSON.stringify(e))
				} else {
					alert(e)
				}
				dispatch({
					type: DataActionTypes.setModal,
					payload: "mintingFailed",
				})
			}
		}
	}
}
