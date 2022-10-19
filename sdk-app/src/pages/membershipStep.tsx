import { FC, useContext, useCallback } from "react"
import { DataActionTypes, StateContext, StepID } from "../components/stateContext"
import { Step } from "../components/step"
import { SubmitButton } from "../components/submitButton/submitButton"


export const KycDAOMembershipStep: FC = () => {
    const { dispatch } = useContext(StateContext)

    const onPrev = useCallback(() => {
        dispatch({ payload: StepID.AgreementStep, type: DataActionTypes.changePage })
    }, [])

    const onSubmit = useCallback(() => {
        dispatch({ type: DataActionTypes.changePage, payload: StepID.verificationStep })
        dispatch({ type: DataActionTypes.termsAcceptedChange, payload: true })
    }, [])

    return <Step onEnter={onSubmit} prev={onPrev} footer={
        <>
            <div className="policy">By starting verification you accept <a href="#">Privacy Policy</a> and <a href="#">Terms &#38; Conditions.</a></div>
            <SubmitButton className="full-width blue" onClick={onSubmit}/>
        </>
    }>
        <h1 className="h1">01 KycDAO Membership</h1>
        <p className="p">kycDAO is building a trusted web3 ecosystem linked together by verified wallets.</p>
        <p className="p">Once verified and proof is minted on-chain, all kycDAO partner services will accept the verification.</p>
        <div className="middle">1 Connect</div>
        <div className="middle">|</div>
        <div className="middle">2 Verify</div>
        <div className="middle">|</div>
        <div className="middle">3 Mint</div>
    </Step>
}