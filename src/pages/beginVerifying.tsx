import { useContext, useCallback, useEffect, FC } from "react"
import { KycDaoContext } from "../components/kycDao.provider"
import { StateContext, DataActionTypes, StepID } from "../components/stateContext"
import { VerificationTypes } from "@kycdao/kycdao-sdk"

let verifyingModalOpen = false

export const BeginVerifyingStep: FC = () => {
    const { dispatch, data: { email, termsAccepted, taxResidency } } = useContext(StateContext)
    const kycDao = useContext(KycDaoContext)

    useEffect(() => {
        if (!kycDao || verifyingModalOpen) {
            return
        }

        verifyingModalOpen = true;

        (async () => {
            try {
                await kycDao.kycDao.registerOrLogin()
                await kycDao.kycDao.startVerification({
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
                        frameAncestors: ['https://localhost:3000', 'https://localhost:5000'],
                        messageTargetOrigin: 'https://localhost:3000'
                    }
                })
            } catch (e) {
                console.error(e)
            }
        })()
    }, [verifyingModalOpen, kycDao])

    const onComplete = useCallback(async () => {
        dispatch({ type: DataActionTypes.changePage, payload: { current: StepID.nftArtSelection } })
        verifyingModalOpen = false
    }, [])

    const onCancel = useCallback(() => {
        dispatch({ payload: { current: StepID.chainSelection }, type: DataActionTypes.changePage })
        verifyingModalOpen = false
    }, [])

    const onError = useCallback((error: string) => {
        console.log(error)
        verifyingModalOpen = false
        // what should be the error page?
    }, [])

    if (!kycDao) {
        return <>Error</>
    }

    return <></>
}
