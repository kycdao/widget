import { useContext, useCallback, useEffect } from "react"
import { StepID, DataActionTypes } from "./reducer"
import { StateContext } from "./stateContext"
import { Inquiry } from "persona"
import { InquiryError } from "persona/dist/lib/interfaces"
import { KycDaoContext } from "./kycDao.provider"

export const BeginVerifyingStep = () => {
    const { dispatch, data: { email, termsAccepted, taxResidency } } = useContext(StateContext)
    const kycDao = useContext(KycDaoContext)

    useEffect(() => {
        if (!kycDao) {
            return
        }

        /*(async () => {
            try {
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
                        onError
                    }
                })
            } catch (e) {
                console.error(e)
            }
        })()*/
    }, [])

    const onComplete = useCallback(async () => {
        dispatch({ type: DataActionTypes.nexPage, payload: StepID.chainSelection })
    }, [])

    const onCancel = useCallback(() => {
        dispatch({ payload: StepID.taxResidenceStep, type: DataActionTypes.nexPage })
    }, [])

    const onError = useCallback((error: InquiryError) => {
        console.log(error)
        // what should be the error page?
    }, [])

    // return <></>

    return  <Inquiry
            templateId='itmpl_Ygs16MKTkA6obnF8C3Rb17dm'
            environment='sandbox'
            onComplete={onComplete}
            onCancel={onCancel}
            onError={onError}
            frameHeight={650}
            frameWidth={400}
            frameAncestors={[window.location.origin, 'http://localhost:5000' ]}
        />
}
