import { useContext, useCallback } from "react"
import { StateContext } from "../components/stateContext"
import { Step } from "../components/step"
import { DataActionTypes, StepID } from "../components/reducer"
import { Button } from "../components/button/button"

export const AgreementStep = () => {
    const { data, dispatch } = useContext(StateContext)!

    const onSubmit = useCallback(() => {
        dispatch({ type: DataActionTypes.nexPage, payload: StepID.kycDAOMembershipStep })
    }, [])

    return <Step header={<h1>KycDAO</h1>} footer={<Button onClick={onSubmit} >Submit</Button>}>
        <p>Lorem ipsum</p>
    </Step>
}
