import { useContext, useCallback } from "react"
import { Button } from "./button/button"
import { DiscordIconSvg } from "./discord-icon-svg/discord-icon-svg.component"
import { Input } from "./input/input.component"
import { StepID, DataActionTypes } from "./reducer"
import { StateContext } from "./stateContext"
import { Step } from "./step"

export const EmailDiscordVerificationStep = () => {
    const { data, dispatch } = useContext(StateContext)

    const onPrev = useCallback(() => {
        dispatch({ payload: StepID.AgreementStep, type: DataActionTypes.nexPage })
    }, [])

    const onEmailChange = useCallback((value: string) => {
        dispatch({ payload: value, type: DataActionTypes.emailChange })
    }, [])

    const onSubmit = useCallback(() => {
        dispatch({ type: DataActionTypes.nexPage, payload: StepID.taxResidenceStep })
    }, [])

    return <Step prev={onPrev} footer={
        <>
            <DiscordIconSvg/><p className="p">Connect Discord</p>
            <Input value={data.email} placeholder={"email"} className="full-width" onChange={onEmailChange}/>
            <Button className="full-width blue" onClick={onSubmit}>Submit</Button>
        </>
    }>
        <h1 className="h1">Email / Discord verification</h1>
        <p className="p">Verify your email / discord via the magic link sent to your address.</p>
    </Step>
}
