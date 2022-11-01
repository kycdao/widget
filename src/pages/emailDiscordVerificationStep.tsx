import { useContext, useCallback, useMemo, FC, useEffect, useState } from "react"
import { Input } from "../components/input/input.component"
import { StateContext, StepID, DataActionTypes, HeaderButtons, OnNext, OnPrev } from "../components/stateContext"
import { Step } from "../components/step/step"
import { SubmitButton } from "../components/submitButton/submitButton"
import { PageProps } from "./pageProps"

const emailRegex = /^[^@]+@[a-z0-9-]+.[a-z]+$/

export const EmailDiscordVerificationStep: FC<PageProps> = ({ className, animation, disabled = false, inactive }) => {
    const { data: { email }, dispatch } = useContext(StateContext)
    const [autoFocus, setAutoFocus] = useState(false)

    const [emailValue, setEmailValue] = useState('')

    const onTransitionDone = useCallback(() => {
        if (email !== '') {
            setEmailValue(email)
        }
        if (!disabled && !inactive) {
            setAutoFocus(true)
            dispatch({ payload: { button: HeaderButtons.prev, state: 'enabled' }, type: DataActionTypes.SetHeaderButtonState })
            dispatch({ payload: { button: HeaderButtons.next, state: email ? 'enabled' : 'hidden' }, type: DataActionTypes.SetHeaderButtonState })
        }
    }, [])

    const disableSubmit = useMemo(() => !emailRegex.test(emailValue), [emailValue])

    useEffect(() => {
        dispatch({ payload: { button: HeaderButtons.next, state: disableSubmit ? 'hidden' : 'enabled' }, type: DataActionTypes.SetHeaderButtonState })
    }, [disableSubmit])

    const onSubmit = useCallback(() => {
        if (!disableSubmit) {
            dispatch({ type: DataActionTypes.emailChange, payload: emailValue })
            dispatch({ type: DataActionTypes.changePage, payload: { current: StepID.taxResidenceStep, prev: StepID.emailDiscordVerificationStep } })
        }
    }, [disableSubmit, emailValue])

    useEffect(() => {
        if (!disabled && !inactive) {
            const next = OnNext.subscribe(onSubmit)
            const prev = OnPrev.subscribe(() => {
                dispatch({ payload: { current: StepID.verificationStep, next: StepID.emailDiscordVerificationStep }, type: DataActionTypes.changePage })
            })

            return () => {
                prev.unsubscribe()
                next.unsubscribe()
            }
        }
    }, [onSubmit, disabled, inactive])

    const onEmailChange = useCallback((value: string) => {
        setEmailValue(value)
    }, [])

    return <Step
        onTransitionDone={onTransitionDone}
        disabled={disabled}
        animation={animation}
        className={className}
        onEnter={onSubmit}
        footer={
            ({disabled, inactive}) =>
                <>
                    <Input autoFocus={autoFocus} disabled={disabled} value={emailValue} placeholder={"email"} className="full-width" onChange={onEmailChange} />
                    <SubmitButton inactive={inactive} disabled={disableSubmit || disabled} className="full-width blue" onClick={onSubmit} />
                </>
        }>
        <h1 className="h1">03 - Email / Discord verification</h1>
        <p className="p">Verify your email / discord via the magic link sent to your address.</p>
    </Step>
}
