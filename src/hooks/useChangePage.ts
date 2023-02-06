import { useCallback, useContext } from "react"
import { DataActionTypes, StateContext, StepID } from "@Components/stateContext"
import { useKycDao } from "@Hooks/useKycDao"

export type Direction = "next" | "prev"

const useChangePage = () => {
	const { dispatch } = useContext(StateContext)
	const kycDao = useKycDao()

	return useCallback(
		async (nextPage: StepID, currentPage?: StepID, direction: Direction = 'next') => {
			try {
				const verificationStatus =
					await kycDao?.kycDao.checkVerificationStatus()
				if (verificationStatus?.KYC) {
					dispatch({
						type: DataActionTypes.changePage,
						payload: {
							current: StepID.nftArtSelection,
							[direction === "next" ? "prev" : "next"]: currentPage,
						},
					})
				} else {
					dispatch({
						type: DataActionTypes.changePage,
						payload: {
							current: nextPage,
							[direction === "next" ? "prev" : "next"]: currentPage,
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
