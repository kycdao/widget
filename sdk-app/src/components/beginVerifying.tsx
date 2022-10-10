import { useContext, useCallback } from "react"
import { Button } from "./button/button"
import { StepID, DataActionTypes } from "./reducer"
import { StateContext } from "./stateContext"
import { Step } from "./step"

export const BeginVerifyingStep = () => {
    const { dispatch } = useContext(StateContext)

    const onPrev = useCallback(() => {
        dispatch({ payload: StepID.AgreementStep, type: DataActionTypes.nexPage })
    }, [])

    const onSubmit = useCallback(() => {
        dispatch({ type: DataActionTypes.nexPage, payload: StepID.idIssuerSelectionStep })
    }, [])

    return <Step prev={onPrev} footer={
        <>
            <div className="policy">By clicking the button below, your consent your Persona, our vendor, collecting, using and utilizing their service providers to process your biometric information to verify your identity, identity fraud and improve Persona&apos;s platform in accordance with its <a href="#">Privacy Policy</a>. Your biometric information will be stored for no more than 3 years.</div>
            <Button className="full-width blue" onClick={onSubmit} label="Begin verifying" />
        </>
    }>
        <h1 className="h1">KYCDAO</h1>
        <p className="p">We need some information to help us confirm your identity.</p>
    </Step>
}
