import { useContext, useCallback, useEffect, FC, useRef } from "react"
import { VerificationTypes } from "@kycdao/kycdao-sdk"
import { useKycDao } from "@Hooks/useKycDao"

import { PageProps } from "./pageProps"
import { DataActionTypes, H1, StateContext, StepID } from "@Components/index"
import useChangePage from "@Hooks/useChangePage"
import useErrorHandler from "@Hooks/useErrorHandler"
import { LoadingCard } from "./loading"

export const BeginVerifyingStep: FC<PageProps> = ({ inactive, disabled }) => {
	const onError = useCallback((error: string) => {
		console.error(error)
		verifyingModalOpen.current = false
		// what should be the error page?
	}, [])

	const { handleError } = useErrorHandler()

	const {
		dispatch,
		data: {
			email,
			termsAccepted,
			taxResidency,
			messageTargetOrigin,
			isEmailConfirmed,
			grantFlowEnabled,
		},
	} = useContext(StateContext)

	useEffect(() => {
		dispatch({
			type: DataActionTypes.SetLoadingMessage,
			payload: "Verification is in progress",
		})
	}, [dispatch])

	const kycDao = useKycDao()
	const verifyingModalOpen = useRef(false)
	const redirect = useChangePage()

	const onComplete = useCallback(() => {
		redirect(StepID.nftArtSelection)
		verifyingModalOpen.current = false
	}, [redirect])

	const onCancel = useCallback(() => {
		/*if (grantFlowEnabled) {
			redirect(StepID.grantSocialSecurityNumberStep, StepID.loading, "prev")
		} else {
			redirect(StepID.taxResidenceStep, StepID.loading, "prev")
		}*/
		dispatch({ type: DataActionTypes.GoToPrevStep })
		verifyingModalOpen.current = false
	}, [dispatch])

	useEffect(() => {
		if (inactive || disabled || !kycDao || verifyingModalOpen.current) {
			return
		}

		if (grantFlowEnabled) {
			redirect(StepID.loading, StepID.grantSocialSecurityNumberStep)
		} else {
			redirect(StepID.loading, StepID.taxResidenceStep)
		}

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
			} catch (error) {
				handleError("fatal", error)
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
		grantFlowEnabled,
		redirect,
		handleError,
	])

	if (!kycDao) {
		return <H1>Error</H1>
	}

	return <LoadingCard />
}
