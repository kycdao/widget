import { useContext, useCallback, useMemo } from "react"
import { Input } from "../components/input/input.component"
import { StateContext, StepID, DataActionTypes } from "../components/stateContext"
import { Step } from "../components/step/step"
import { SubmitButton } from "../components/submitButton/submitButton"

const emailRegex = /^[^@]+@[a-z0-9-]+.[a-z]+$/

export const EmailDiscordVerificationStep = () => {
    const { data, dispatch } = useContext(StateContext)

    const onPrev = useCallback(() => {
        dispatch({ payload: StepID.verificationStep, type: DataActionTypes.changePage })
    }, [])

    const onEmailChange = useCallback((value: string) => {
        dispatch({ payload: value, type: DataActionTypes.emailChange })
    }, [])
    
    const disableSubmit = useMemo(() => {
        return !emailRegex.test(data.email)
    }, [data.email])

    const onSubmit = useCallback(() => {
        if(!disableSubmit) {
            dispatch({ type: DataActionTypes.changePage, payload: StepID.taxResidenceStep })
        }
    }, [disableSubmit])

    return <Step onEnter={ onSubmit } prev={onPrev} footer={
        <>
            {/*<span style={{ display: 'inline-flex' }}>
                <div style={{ background: '#7289d9', width: 60, height: 60, display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                    <img style={{ width: 40, height: 40 }} src="images/discord.svg" />
                </div>
                <p className="p" style={{ alignSelf: 'center', marginLeft: '1em' }}>Connect Discord</p>
    </span>*/}
            <Input autoFocus value={data.email} placeholder={"email"} className="full-width" onChange={onEmailChange} />
            <SubmitButton disabled={disableSubmit} className="full-width blue" onClick={onSubmit} />
        </>
    }>
        <h1 className="h1">Email / Discord verification</h1>
        <p className="p">Verify your email / discord via the magic link sent to your address.</p>
    </Step>
}
