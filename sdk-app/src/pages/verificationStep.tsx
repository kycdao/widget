import { useContext, useCallback, FC, useEffect } from "react"
import { StateContext, StepID, DataActionTypes } from "../components/stateContext"
import { Step, StepAnimation } from "../components/step/step"
import { SubmitButton } from "../components/submitButton/submitButton"

export const VerificationStep: FC<{ className?: string, animation?: StepAnimation, disabled: boolean }> = ({ className, disabled = false, animation }) => {
    const { dispatch, data: { onNext, onPrev } } = useContext(StateContext)

    const onSubmit = useCallback(() => {
        dispatch({ type: DataActionTypes.changePage, payload: { current: StepID.emailDiscordVerificationStep, prev: StepID.verificationStep } })
    }, [])

    useEffect(() => {
        if (!disabled) {
            const next = onNext.subscribe(onSubmit)
            return next.unsubscribe.bind(next)
        }
    }, [disabled])

    useEffect(() => {
        if (!disabled) {
            const prev = onPrev.subscribe(() => {
                dispatch({ payload: { current: StepID.kycDAOMembershipStep, next: StepID.verificationStep }, type: DataActionTypes.changePage })
            })
            return prev.unsubscribe.bind(prev)
        }
    }, [disabled])

    return <Step disabled={disabled} animation={animation} className={className} onEnter={onSubmit} footer={(disabled) => <SubmitButton disabled={disabled} className="full-width blue" onClick={onSubmit} />}>
        <h1 className="h1">02 - ID Verification</h1>
        <p className="p">We are using 3rd party partners to collect information for verification.</p>
        <p className="p">During the verification you wil be asked:</p>
        <ul>
            <li className="li"><p>government ID</p></li>
            <li className="li"><p>selfie</p></li>
        </ul>
    </Step>
}
