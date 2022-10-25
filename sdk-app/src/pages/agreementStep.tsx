import { useContext, useCallback, FC, useEffect } from "react"
import { DataActionTypes, StateContext, StepID } from "../components/stateContext"
import { Step, StepAnimation } from "../components/step/step"
import { SubmitButton } from "../components/submitButton/submitButton"

export const AgreementStep: FC<{ className?: string, animation?: StepAnimation, disabled: boolean }> = ({ className, animation, disabled }) => {
    const { dispatch, data: { onNext } } = useContext(StateContext)

    const onSubmit = useCallback(() => dispatch({ type: DataActionTypes.changePage, payload: { current: StepID.kycDAOMembershipStep, prev: StepID.AgreementStep } }), [])

    useEffect(() => {
        const next = onNext.subscribe(onSubmit)
        return next.unsubscribe.bind(next)
    }, [])

    return <Step disabled={disabled} className={className} animation={animation} header={() => <h1 className="h1">KycDAO</h1>} onEnter={onSubmit} footer={(disabled) => <SubmitButton disabled={disabled} className="full-width blue" onClick={onSubmit} />}>
        <p>Lorem ipsum</p>
    </Step>
}
