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


        <div className="loading-animation ">

            <svg className="part-1" width="43" height="26" viewBox="0 0 43 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M42.701 3.71317L38.9878 0L21.3503 17.6375L16.7088 12.9961L12.9956 16.7092L21.3503 25.0639L42.701 3.71317ZM0 3.71321L9.28292 12.9961L12.9961 9.28296L3.71317 4.60767e-05L0 3.71321Z" fill="#3D65F2"/>
            </svg>

            <svg className="part-2" width="43" height="26" viewBox="0 0 43 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M-0.000108705 3.71317L3.71306 0L21.3506 17.6375L25.9921 12.9961L29.7052 16.7092L21.3506 25.0639L-0.000108705 3.71317ZM42.7017 3.71321L33.4187 12.9961L29.7056 9.28296L38.9885 4.35823e-05L42.7017 3.71321Z" fill="#3D65F2"/>
            </svg>

            <svg className="part-3" width="43" height="26" viewBox="0 0 43 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M42.701 3.71317L38.9878 0L21.3503 17.6375L16.7088 12.9961L12.9956 16.7092L21.3503 25.0639L42.701 3.71317ZM0 3.71321L9.28292 12.9961L12.9961 9.28296L3.71317 4.60767e-05L0 3.71321Z" fill="#3D65F2"/>
            </svg>

        </div>

    </Step>
}
