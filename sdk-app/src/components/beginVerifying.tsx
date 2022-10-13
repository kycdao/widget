import { useContext, useCallback } from "react"
import { StepID, DataActionTypes } from "./reducer"
import { StateContext } from "./stateContext"
import { Inquiry } from "persona"
import { Fields, InquiryError } from "persona/dist/lib/interfaces"
import { KycDaoContext } from "./kycDao.provider"
import { VerificationTypes } from "@kycdao/kycdao-sdk"

export const BeginVerifyingStep = () => {
    const { dispatch, data: { email, termsAccepted, taxResidency } } = useContext(StateContext)
    const kycDao = useContext(KycDaoContext)

    const onPrev = useCallback(() => {
        dispatch({ payload: StepID.AgreementStep, type: DataActionTypes.nexPage })
    }, [])

    const onComplete = useCallback(async ({ inquiryId, status, fields }: {
        inquiryId: string;
        status: string;
        fields: Fields;
    }) => {
        // Inquiry completed. Optionally tell your server about it.
        console.log(`Sending finished inquiry ${inquiryId} to backend`);

        if(!kycDao) {
            return
        }

        try {
            await kycDao?.kycDao.startVerification({
                email,
                isEmailConfirmed: true, // @TODO
                isLegalEntity: false, // @TODO
                taxResidency,
                termsAccepted,
                verificationType: VerificationTypes.KYC
            })
    
            dispatch({ type: DataActionTypes.nexPage, payload: StepID.nftArtSelection })
        } catch {
            // dispatch({ type: DataActionTypes.nexPage, payload: StepID.nftArtSelection })
        }
    }, [])

    const onCancel = useCallback(({ inquiryId, sessionToken }: {
        inquiryId?: string;
        sessionToken?: string;
    }) => {
        dispatch({ payload: StepID.taxResidenceStep, type: DataActionTypes.nexPage })
    }, [])

    const onError = useCallback((error: InquiryError) => {
        // what should be the error page?
    }, [])

    return <Inquiry
        templateId='itmpl_Ygs16MKTkA6obnF8C3Rb17dm'
        environment='sandbox'
        onComplete={onComplete}
        onCancel={onCancel}
        onError={onError}
        frameHeight={650}
        frameWidth={400}
    />
}
