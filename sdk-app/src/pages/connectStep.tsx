import { useContext, useCallback } from "react"
import { StateContext } from "../components/stateContext"
import { Step } from "../components/step"
import { DataActionTypes, StepID } from "../components/reducer"
import { Submit } from "./steps"

export const AgreementStep = () => {
    const {data, dispatch} = useContext(StateContext)!

    const onSubmit = useCallback(() => {
        dispatch({type: DataActionTypes.nexPage, payload: StepID.kycDAOMembershipStep})
    }, [])

    return <Step header={<h1>Guild and KycDAO</h1>} footer={<Submit label="OK" onClick={onSubmit} />}>
        <p>Lorem ipsum</p>
    </Step>
}
