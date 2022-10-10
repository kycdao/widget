import { useContext, useCallback } from "react"
import { Button } from "./button/button"
import { DiscordIconSvg } from "./discord-icon-svg/discord-icon-svg.component"
import { Input } from "./input/input.component"
import { StepID, DataActionTypes } from "./reducer"
import { StateContext } from "./stateContext"
import { Step } from "./step"

export const TaxResidenceStep = () => {
    const { data, dispatch } = useContext(StateContext)

    const onPrev = useCallback(() => {
        dispatch({ payload: StepID.AgreementStep, type: DataActionTypes.nexPage })
    }, [])

    const onEmailChange = useCallback((value: string) => {
        dispatch({ payload: value, type: DataActionTypes.emailChange })
    }, [])

    const onSubmit = useCallback(() => {
        dispatch({ type: DataActionTypes.nexPage, payload: StepID.verificationStep })
    }, [])

    return <Step prev={onPrev} footer={
        <>
            <Input value={data.email} placeholder={"Type your tax residence here"} className="full-width" onChange={onEmailChange}/>
            <Button className="full-width blue" onClick={onSubmit}>Submit</Button>
        </>
    }>
        <h1 className="h1">Tax residence</h1>
        <p className="p">Please select the country where you are currently a tax residence.</p>
    </Step>
}
