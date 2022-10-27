import { useContext, useCallback, FC, useEffect } from "react"
import { StateContext, StepID, DataActionTypes, HeaderButtons, OnPrev } from "../components/stateContext"
import { Step, StepAnimation } from "../components/step/step"
import { OnNext } from "../components/stateContext"
import { SubmitButton } from "../components/submitButton/submitButton"

export const VerificationStep: FC<{ className?: string, animation?: StepAnimation, disabled?: boolean }> = ({ className, disabled = false, animation }) => {
    const { dispatch } = useContext(StateContext)

    const onSubmit = useCallback(() => {
        dispatch({ type: DataActionTypes.changePage, payload: { current: StepID.emailDiscordVerificationStep, prev: StepID.verificationStep } })
    }, [])

    useEffect(() => {
        if (!disabled) {
            const next = OnNext.subscribe(onSubmit)
            return next.unsubscribe.bind(next)
        }
    }, [disabled])

    useEffect(() => {
        if (!disabled) {
            const prev = OnPrev.subscribe(() => {
                dispatch({ payload: { current: StepID.kycDAOMembershipStep, next: StepID.verificationStep }, type: DataActionTypes.changePage })
            })
            return prev.unsubscribe.bind(prev)
        }
    }, [disabled])

    const onTransitionDone = () => {
        if (!disabled) {
            dispatch({ payload: { button: HeaderButtons.prev, state: 'enabled' }, type: DataActionTypes.SetHeaderButtonState })
            dispatch({ payload: { button: HeaderButtons.next, state: 'enabled' }, type: DataActionTypes.SetHeaderButtonState })
        }
    }

    return <Step onTransitionDone={onTransitionDone} disabled={disabled} animation={animation} className={className} onEnter={onSubmit} footer={(disabled) => <SubmitButton disabled={disabled} className="full-width blue" onClick={onSubmit} />}>
        <h1 className="h1">02 - ID Verification</h1>
        <p className="p">We are using 3rd party partners to collect information for verification.</p>
        <p className="p">During the verification you wil be asked:</p>
        <ul>
            <li className="li"><p>government ID</p></li>
            <li className="li"><p>selfie</p></li>
        </ul>
    </Step>
}
