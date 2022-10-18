import { FC, useContext, useCallback } from "react"
import { DataActionTypes, StateContext, StepID } from "../components/stateContext"
import { Step } from "../components/step/step"
import { SubmitButton } from "../components/submitButton/submitButton"


export const KycDAOMembershipStep: FC = () => {
    const { dispatch } = useContext(StateContext)

    const onPrev = useCallback(() => {
        dispatch({ payload: StepID.AgreementStep, type: DataActionTypes.nexPage })
    }, [])

    const onSubmit = useCallback(() => {
        dispatch({ type: DataActionTypes.nexPage, payload: StepID.verificationStep })
        dispatch({ type: DataActionTypes.termsAcceptedChange, payload: true })
    }, [])

    return <Step onEnter={onSubmit} prev={onPrev} next={onSubmit} footer={
        <>
            <div className="policy">By starting verification you accept <a href="#">Privacy Policy</a> and <a href="#">Terms &#38; Conditions.</a></div>
            <SubmitButton className="full-width blue" onClick={onSubmit}/>
        </>
    }>
        <h1 className="h1">01 KycDAO Membership</h1>
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

        {/*<div className="middle">1 Connect</div>*/}
        {/*<div className="middle">|</div>*/}
        {/*<div className="middle">2 Verify</div>*/}
        {/*<div className="middle">|</div>*/}
        {/*<div className="middle">3 Mint</div>*/}

    </Step>
}