import { useContext, useCallback, useEffect } from "react"
import { KycDaoContext } from "../components/kycDao.provider"
import { StateContext, DataActionTypes, StepID } from "../components/stateContext"
import { VerificationTypes } from "@kycdao/kycdao-sdk"

export const BeginVerifyingStep = () => {
    const { dispatch, data: { email, termsAccepted, taxResidency } } = useContext(StateContext)
    const kycDao = useContext(KycDaoContext)

    useEffect(() => {
        if (!kycDao) {
            return
        }

        (async () => {
            try {
                await kycDao?.kycDao.registerOrLogin()
                await kycDao?.kycDao.startVerification({
                    email,
                    isEmailConfirmed: true, // @TODO
                    isLegalEntity: false, // @TODO
                    taxResidency,
                    termsAccepted,
                    verificationType: VerificationTypes.KYC
                }, {
                    personaOptions: {
                        onCancel,
                        onComplete,
                        onError,
                        frameAncestors: ['http://localhost:5000'],
                        messageTargetOrigin: 'http://localhost:5000'
                    }
                })
            } catch (e) {
                console.error(e)
            }

            setTimeout(() => {
                document.querySelector('iframe')?.setAttribute('allow')
            }, 1000);            
        })()
    }, [])

    const onComplete = useCallback(async () => {
        dispatch({ type: DataActionTypes.nexPage, payload: StepID.nftArtSelection })
    }, [])

    const onCancel = useCallback(() => {
        dispatch({ payload: StepID.taxResidenceStep, type: DataActionTypes.nexPage })
    }, [])

    const onError = useCallback((error: string) => {
        console.log(error)
        // what should be the error page?
    }, [])

    if(!kycDao) {
        return <>Error</>
    }

    return <></>
}
