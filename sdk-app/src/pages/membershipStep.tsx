import { FC, useContext, useCallback, useEffect } from "react"
import { DataActionTypes, StateContext, StepID } from "../components/stateContext"
import { Step, StepAnimation } from "../components/step/step"
import { SubmitButton } from "../components/submitButton/submitButton"


export const KycDAOMembershipStep: FC<{ className?: string, animation?: StepAnimation, disabled: boolean }> = ({ className, animation, disabled = false }) => {
    const { dispatch, data: { onPrev, onNext } } = useContext(StateContext)

    useEffect(() => {
        if (!disabled) {
            const prev = onPrev.subscribe(() => {
                dispatch({ payload: { current: StepID.AgreementStep, next: StepID.kycDAOMembershipStep }, type: DataActionTypes.changePage })
            })
            return prev.unsubscribe.bind(prev)
        }
    }, [disabled])

    const onSubmit = useCallback(() => {
        dispatch({ type: DataActionTypes.changePage, payload: { current: StepID.verificationStep, prev: StepID.kycDAOMembershipStep } })
        dispatch({ type: DataActionTypes.termsAcceptedChange, payload: true })
    }, [])

    useEffect(() => {
        if (!disabled) {
            const next = onNext.subscribe(onSubmit)
            return next.unsubscribe.bind(next)
        }
    }, [disabled])

    return <Step disabled={disabled} animation={animation} className={className} onEnter={onSubmit} footer={(disabled) =>
        <>
            <div className="policy">By starting verification you accept <a href="#">Privacy Policy</a> and <a href="#">Terms &#38; Conditions.</a></div>
            <SubmitButton disabled={disabled} className="full-width blue" onClick={onSubmit} />
        </>
    }>
        <h1 className="h1">01 - KycDAO Membership</h1>
        <p className="p">kycDAO is building a trusted web3 ecosystem linked together by verified wallets.</p>
        <p className="p">Once verified and proof is minted on-chain, all kycDAO partner services will accept the verification.</p>
        <div className="the-process">
            <ul>
                <li>
                    <span>1</span>
                    <p>Connect</p>
                </li>
                <li>
                    <span>2</span>
                    <p>Verify</p>
                </li>
                <li>
                    <span>3</span>
                    <p>Verify</p>
                </li>
            </ul>

        </div>
    </Step>
}