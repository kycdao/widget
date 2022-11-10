import { useContext, useCallback, useEffect, FC, useRef } from "react"
import { KycDaoContext } from "../components/kycDao.provider"
import {
	StateContext,
	DataActionTypes,
	StepID,
} from "../components/stateContext"
import { VerificationTypes } from "@kycdao/kycdao-sdk"
import { PageProps } from "./pageProps"

export const BeginVerifyingStep: FC<PageProps> = ({ inactive, disabled }) => {
	const {
		dispatch,
		data: { email, termsAccepted, taxResidency, messageTargetOrigin },
	} = useContext(StateContext)
	const kycDao = useContext(KycDaoContext)
	const verifyingModalOpen = useRef(false)

	useEffect(() => {
		if (
			inactive ||
			disabled ||
			!kycDao ||
			verifyingModalOpen.current === true
		) {
			return
		}

		dispatch({
			type: DataActionTypes.changePage,
			payload: {
				current: StepID.loading,
				prev: StepID.chainSelection,
			},
		})

		verifyingModalOpen.current = true
		;(async () => {
			try {
				await kycDao.kycDao.registerOrLogin()
				await kycDao.kycDao.startVerification(
					{
						email,
						isEmailConfirmed: true, // @TODO
						isLegalEntity: false, // @TODO
						taxResidency,
						termsAccepted,
						verificationType: VerificationTypes.KYC,
					},
					{
						personaOptions: {
							onCancel,
							onComplete,
							onError,
							frameAncestors: messageTargetOrigin
								? [messageTargetOrigin]
								: undefined,
							messageTargetOrigin: window.self.origin,
						},
					}
				)
			} catch (e) {
				console.error(e)
			}
		})()
	}, [verifyingModalOpen, kycDao, inactive, disabled])

	const onComplete = useCallback(async () => {
		dispatch({
			type: DataActionTypes.changePage,
			payload: { current: StepID.nftArtSelection },
		})
		verifyingModalOpen.current = false
	}, [])

	const onCancel = useCallback(() => {
		dispatch({
			payload: { current: StepID.chainSelection },
			type: DataActionTypes.changePage,
		})
		verifyingModalOpen.current = false
	}, [])

	const onError = useCallback((error: string) => {
		console.log(error)
		verifyingModalOpen.current = false
		// what should be the error page?
	}, [])

	if (!kycDao) {
		return <>Error</>
	}

	return <></>
}
