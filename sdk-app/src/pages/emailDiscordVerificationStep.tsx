import { useContext, useCallback, useMemo, FC, useEffect } from "react"
import { Input } from "../components/input/input.component"
import { StateContext, StepID, DataActionTypes } from "../components/stateContext"
import { Step, StepAnimation } from "../components/step/step"
import { SubmitButton } from "../components/submitButton/submitButton"

const emailRegex = /^[^@]+@[a-z0-9-]+.[a-z]+$/

export const EmailDiscordVerificationStep: FC<{ className?: string, animation?: StepAnimation, disabled?: boolean }> = ({ className, animation, disabled = false }) => {
    const { data: { onPrev, email, onNext }, dispatch } = useContext(StateContext)

    useEffect(() => {
        const prev = onPrev.subscribe(() =>
            dispatch({ payload: { current: StepID.verificationStep, next: StepID.emailDiscordVerificationStep }, type: DataActionTypes.changePage }))
        return prev.unsubscribe.bind(prev)
    }, [])

    const disableSubmit = useMemo(() => {
        return !emailRegex.test(email)
    }, [email])

    const onSubmit = useCallback(() => {
        if (!disableSubmit) {
            dispatch({ type: DataActionTypes.changePage, payload: { current: StepID.taxResidenceStep, prev: StepID.emailDiscordVerificationStep } })
        }
    }, [disableSubmit])

    useEffect(() => {
        const next = onNext.subscribe(onSubmit)
        return next.unsubscribe.bind(next)
    })

    const onEmailChange = useCallback((value: string) => {
        dispatch({ payload: value, type: DataActionTypes.emailChange })
    }, [])

    return <Step disabled={disabled} animation={animation} className={className} onEnter={onSubmit} footer={
        (disabled) =>
            <>
                <Input autoFocus={!disabled} value={email} placeholder={"email"} className="full-width" onChange={onEmailChange} />
                <SubmitButton disabled={disableSubmit} className="full-width blue" onClick={onSubmit} />
            </>
    }>
        <h1 className="h1">03 - Email / Discord verification</h1>
        <p className="p">Verify your email / discord via the magic link sent to your address.</p>
    </Step>
}
