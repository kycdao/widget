import { useContext, useCallback } from "react"
import { DataActionTypes, StateContext, StepID } from "../components/stateContext"
import { Step } from "../components/step/step"
import { SubmitButton } from "../components/submitButton/submitButton"

export const AgreementStep = () => {
    const { dispatch } = useContext(StateContext)

    const onSubmit = useCallback(() => {
        dispatch({ type: DataActionTypes.nexPage, payload: StepID.kycDAOMembershipStep })
    }, [])

    return <Step header={<h1 className="h1">KycDAO</h1>} onEnter={onSubmit} footer={<SubmitButton className="full-width blue" onClick={onSubmit} />}>
        <p>Lorem ipsum</p>
    </Step>
}
