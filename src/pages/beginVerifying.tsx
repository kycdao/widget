import { useContext, useCallback, useEffect, FC, useRef } from "react"
import { VerificationTypes } from "@kycdao/kycdao-sdk"
import { useKycDao } from "@Hooks/useKycDao"

import { PageProps } from "./pageProps"
import {
	H1,
	KycDaoContext,
	StateContext,
	StepID,
} from "@Components/index"
import useChangePage from "@Hooks/useChangePage"

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
	const redirect = useChangePage()
	const kycDaoContext = useContext(KycDaoContext)

	const onComplete = useCallback(async () => {
		await redirect(StepID.nftArtSelection)
		verifyingModalOpen.current = false
	}, [redirect])

	const onCancel = useCallback(async () => {
		if (kycDaoContext?.grantFlowEnabled) {
			await redirect(StepID.grantSocialSecurityNumberStep, StepID.loading)
		} else {
			await redirect(StepID.taxResidenceStep, StepID.loading)
		}
		verifyingModalOpen.current = false
	}, [kycDaoContext?.grantFlowEnabled, redirect])

	useEffect(() => {
		if (inactive || disabled || !kycDao || verifyingModalOpen.current) {
			return
		}

		if (kycDaoContext?.grantFlowEnabled) {
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
