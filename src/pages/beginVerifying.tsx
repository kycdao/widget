import { useContext, useCallback, useEffect, FC, useRef } from "react"
import { StateContext, DataActionTypes, StepID } from "@Components/stateContext"
import { VerificationTypes } from "@kycdao/kycdao-sdk"
import { PageProps } from "./pageProps"
import { useKycDao } from "@Hooks/useKycDao"
import { H1 } from "@Style/index"

export const BeginVerifyingStep: FC<PageProps> = ({ inactive, disabled }) => {
	const onError = useCallback((error: string) => {
		console.log(error)
		verifyingModalOpen.current = false
		// what should be the error page?
	}, [])

	const {
		dispatch,
		data: {
			email,
			termsAccepted,
			taxResidency,
			messageTargetOrigin,
			isEmailConfirmed,
		},
	} = useContext(StateContext)
	const kycDao = useKycDao()
	const verifyingModalOpen = useRef(false)

	const onComplete = useCallback(async () => {
		dispatch({
			type: DataActionTypes.changePage,
			payload: { current: StepID.nftArtSelection },
		})
		verifyingModalOpen.current = false
	}, [dispatch])

	const onCancel = useCallback(() => {
		dispatch({
			payload: { current: StepID.taxResidenceStep, next: StepID.loading },
			type: DataActionTypes.changePage,
		})
		verifyingModalOpen.current = false
	}, [dispatch])

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
				prev: StepID.taxResidenceStep,
			},
		})

		verifyingModalOpen.current = true
		;(async () => {
			try {
				await kycDao.kycDao.startVerification(
					{
						email,
						isEmailConfirmed,
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
	}, [
		verifyingModalOpen,
		kycDao,
		inactive,
		disabled,
		onCancel,
		onComplete,
		dispatch,
		email,
		onError,
		messageTargetOrigin,
		taxResidency,
		termsAccepted,
		isEmailConfirmed,
	])

	if (!kycDao) {
		return <H1>Error</H1>
	}

	return <></>
}
