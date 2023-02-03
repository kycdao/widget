import { useCallback, useContext } from "react"
import { DataActionTypes, StateContext, StepID } from "@Components/stateContext"
import { useKycDao } from "@Hooks/useKycDao"

const useChangePage = () => {
	const { dispatch } = useContext(StateContext)
	const kycDao = useKycDao()

	return useCallback(
		async (nextPage: StepID, currentPage?: StepID) => {
			try {
				const verificationStatus =
					await kycDao?.kycDao.checkVerificationStatus()
				if (verificationStatus?.KYC) {
					dispatch({
						type: DataActionTypes.changePage,
						payload: {
							current: StepID.nftArtSelection,
							prev: currentPage,
						},
					})
				} else {
					dispatch({
						type: DataActionTypes.changePage,
						payload: {
							current: nextPage,
							prev: currentPage,
						},
					})
				}
			} catch (e) {
				console.error(e)
			}
		},
		[dispatch, kycDao?.kycDao]
	)
}

export default useChangePage
