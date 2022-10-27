import { useContext, useCallback, FC, useEffect } from "react"
import { DataActionTypes, HeaderButtons, OnNext, StateContext, StepID } from "../components/stateContext"
import { Step, StepAnimation } from "../components/step/step"
import { SubmitButton } from "../components/submitButton/submitButton"

export const AgreementStep: FC<{ className?: string, animation?: StepAnimation, disabled?: boolean }> = ({ className, animation, disabled = false }) => {
    const { dispatch } = useContext(StateContext)

    const onSubmit = useCallback(() => {
        dispatch({ type: DataActionTypes.changePage, payload: { current: StepID.kycDAOMembershipStep, prev: StepID.AgreementStep } })
    }, [])

    const onTransitionDone = () => {
        if (!disabled) {
            dispatch({ payload: { button: HeaderButtons.prev, state: 'hidden' }, type: DataActionTypes.SetHeaderButtonState })
            dispatch({ payload: { button: HeaderButtons.next, state: 'enabled' }, type: DataActionTypes.SetHeaderButtonState })
        }
    }

    useEffect(() => {
        if (!disabled) {
            const next = OnNext.subscribe(onSubmit)
            return next.unsubscribe.bind(next)
        }
    }, [disabled])

    return <Step
        onTransitionDone={onTransitionDone}
        disabled={disabled}
        className={className}
        animation={animation}
        header={() => <h1 className="h1">KycDAO</h1>}
        onEnter={onSubmit}
        footer={(disabled, transitionDone) => <SubmitButton autoFocus={transitionDone} disabled={disabled} className="full-width blue" onClick={onSubmit} />}>
        <p>Lorem ipsum</p>
    </Step>
}
