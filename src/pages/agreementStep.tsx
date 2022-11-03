import { useContext, useCallback, FC, useEffect } from "react"
import { DataActionTypes, HeaderButtons, OnNext, StateContext, StepID } from "../components/stateContext"
import { Step } from "../components/step/step"
import { SubmitButton } from "../components/submitButton/submitButton"
import { PageProps } from "./pageProps"

export const AgreementStep: FC<PageProps> = ({ className, animation, disabled = false, inactive }) => {
    const { dispatch } = useContext(StateContext)

    const onSubmit = useCallback(() => {
        dispatch({ type: DataActionTypes.changePage, payload: { current: StepID.kycDAOMembershipStep, prev: StepID.AgreementStep } })
    }, [])

    const onTransitionDone = () => {
        if (!disabled && !inactive) {
            dispatch({ payload: { button: HeaderButtons.prev, state: 'hidden' }, type: DataActionTypes.SetHeaderButtonState })
            dispatch({ payload: { button: HeaderButtons.next, state: 'enabled' }, type: DataActionTypes.SetHeaderButtonState })
        }
    }

    useEffect(() => {
        if (!disabled && !inactive) {
            const next = OnNext.subscribe(onSubmit)
            return next.unsubscribe.bind(next)
        }
    }, [disabled])

    return <Step
        onTransitionDone={onTransitionDone}
        disabled={disabled}
        className={className}
        inactive={inactive}
        animation={animation}
        header={() => <h1 className="h1">KycDAO</h1>}
        onEnter={onSubmit}
        footer={({ disabled, inactive }) => <SubmitButton
            autoFocus={!inactive && !disabled}
            disabled={disabled}
            className="full-width blue"
            onClick={onSubmit}
            inactive={inactive} />}>
        <p>Lorem ipsum</p>
    </Step>
}
