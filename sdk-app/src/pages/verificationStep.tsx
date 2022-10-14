import { useContext, useCallback } from "react"
import { Button } from "../components/button/button"
import { StateContext, StepID, DataActionTypes } from "../components/stateContext"
import { Step } from "../components/step"
import { SubmitButton } from "../components/submitButton/submitButton"

export const VerificationStep = () => {
    const {dispatch} = useContext(StateContext)

    const onPrev = useCallback( () => {
        dispatch({ payload: StepID.kycDAOMembershipStep, type: DataActionTypes.nexPage })
    }, [])

    const onSubmit = useCallback(() => {
        dispatch({ type: DataActionTypes.nexPage, payload: StepID.emailDiscordVerificationStep })
    }, [])

    return <Step onEnter={onSubmit} prev={onPrev} footer={<SubmitButton className="full-width blue" onClick={onSubmit}/>}>
        <h1 className="h1">02 ID Verification</h1>
        <p className="p">We are using 3rd party partners to collect information for verification.</p>
        <p className="p">During the verification you wil be asked:</p>
        <ul>
            <li className="li"><p>government ID</p></li>
            <li className="li"><p>selfie</p></li>
        </ul>
    </Step>
}