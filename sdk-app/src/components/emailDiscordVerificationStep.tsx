import { useContext, useCallback } from "react"
import { Button } from "./button/button"
import { Input } from "./input/input.component"
import { StepID, DataActionTypes } from "./reducer"
import { StateContext } from "./stateContext"
import { Step } from "./step"

const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

export const EmailDiscordVerificationStep = () => {
    const { data, dispatch } = useContext(StateContext)

    const onPrev = useCallback(() => {
        dispatch({ payload: StepID.verificationStep, type: DataActionTypes.nexPage })
    }, [])

    const onEmailChange = useCallback((value: string) => {
        dispatch({ payload: value, type: DataActionTypes.emailChange })
    }, [])

    const onSubmit = useCallback(() => {
        dispatch({ type: DataActionTypes.nexPage, payload: StepID.taxResidenceStep })
    }, [])

    return <Step prev={onPrev} footer={
        <>
            <span style={{ display: 'inline-flex' }}>
                <div style={{ background: '#7289d9', width: 60, height: 60, display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                    <img style={{ width: 40, height: 40 }} src="images/discord.svg" />
                </div>
                <p className="p" style={{ alignSelf: 'center', marginLeft: '1em' }}>Connect Discord</p>
            </span>
            <Input value={data.email} placeholder={"email"} className="full-width" onChange={onEmailChange} />
            <Button disabled={!emailRegex.test(data.email)} className="full-width blue" onClick={onSubmit} />
        </>
    }>
        <h1 className="h1">Email / Discord verification</h1>
        <p className="p">Verify your email / discord via the magic link sent to your address.</p>
    </Step>
}
