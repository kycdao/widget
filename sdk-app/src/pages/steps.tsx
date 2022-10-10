import { FC, useCallback, useContext } from "react"
import { Step } from "../components/step"
import { DataActionTypes, StepID } from "../components/reducer"
import { Button } from "../components/button/button"
import { StateContext } from "../components/stateContext"

export const KycDAOMembershipStep: FC = () => {
    const {data, dispatch} = useContext(StateContext)

    const onPrev = useCallback( () => {
        dispatch({ payload: StepID.AgreementStep, type: DataActionTypes.nexPage })
    }, [])

    const onSubmit = useCallback(() => {
        dispatch({ type: DataActionTypes.nexPage, payload: StepID.verificationStep })
    }, [])

    return <Step prev={onPrev} footer={<Button onClick={onSubmit}>Submit</Button>}>
        <h1 className="h1">01 KycDAO Membership</h1>
        <p className="p">kycDAO is building a trusted web3 ecosystem linked together by verified wallets.</p>
        <p className="p">Once verified and proof is minted on-chain, all kycDAO partner services will accept the verification.</p>
        <div className="middle">1 Connect</div>
        <div className="middle">|</div>
        <div className="middle">2 Verify</div>
        <div className="middle">|</div>
        <div className="middle">3 Mint</div>
        <span style={{ position: 'absolute', bottom: '6em' }} className="policy">By starting verification you accept <a href="#">Privacy Policy</a> and <a href="#">Terms &#38; Conditions.</a></span>
    </Step>
}

export const VerificationStep = () => {
    const {data, dispatch} = useContext(StateContext)

    const onPrev = useCallback( () => {
        dispatch({ payload: StepID.kycDAOMembershipStep, type: DataActionTypes.nexPage })
    }, [])

    const onSubmit = useCallback(() => {
        dispatch({ type: DataActionTypes.nexPage, payload: StepID.emailDiscordVerificationStep })
    }, [])

    return <Step prev={onPrev} footer={<Button onClick={onSubmit}>Submit</Button>}>
        <h1 className="h1">02 ID Verification</h1>
        <p className="p">We are using 3rd party partners to collect information for verification.</p>
        <p className="p">During the verification you wil be asked:</p>
        <ul>
            <li className="li"><p>government ID</p></li>
            <li className="li"><p>selfie</p></li>
        </ul>
    </Step>
}

export const EmailDiscordVerificationStep = () => {
    const {data, dispatch} = useContext(StateContext)

    const onPrev = useCallback( () => {
        dispatch({ payload: StepID.AgreementStep, type: DataActionTypes.nexPage })
    }, [])

    const onSubmit = useCallback(() => {
        dispatch({ type: DataActionTypes.nexPage, payload: StepID.verificationStep })
    }, [])

    return <Step prev={onPrev} footer={<Button onClick={onSubmit}>Submit</Button>}>
        <h1 className="h1">01 KycDAO Membership</h1>
        <p className="p">kycDAO is building a trusted web3 ecosystem linked together by verified wallets.</p>
        <p className="p">Once verified and proof is minted on-chain, all kycDAO partner services will accept the verification.</p>
        <div className="middle">1 Connect</div>
        <div className="middle">|</div>
        <div className="middle">2 Verify</div>
        <div className="middle">|</div>
        <div className="middle">3 Mint</div>
        <span style={{ position: 'absolute', bottom: '6em' }} className="policy">By starting verification you accept <a href="#">Privacy Policy</a> and <a href="#">Terms &#38; Conditions.</a></span>
    </Step>
}

export const TaxResidenceStep = () => {
    return <Step >
        <h1>KycDAO</h1>
        <p>Lorem ipsum</p>
        <Button />
    </Step>
}

export const BeginVerifyingStep = () => {
    return <Step >
        <h1>KycDAO</h1>
        <p>Lorem ipsum</p>
        <Button />
    </Step>
}

export const GovernmentIDSelectionStep = () => {
    return <Step >
        <h1>KycDAO</h1>
        <p>Lorem ipsum</p>
        <Button />
    </Step>
}

export const UploadIDPhotoTypeStep = () => {
    return <Step >
        <h1>KycDAO</h1>
        <p>Lorem ipsum</p>
        <Button />
    </Step>
}

export const UploadIDPhotoStep = () => {
    return <Step >
        <h1>KycDAO</h1>
        <p>Lorem ipsum</p>
        <Button />
    </Step>
}

export const TakePhotoStep = () => {
    return <Step >
        <h1>KycDAO</h1>
        <p>Lorem ipsum</p>
        <Button />
    </Step>
}

export const ProcessingStep = () => {
    return <Step >
        <h1>KycDAO</h1>
        <p>Lorem ipsum</p>
        <Button />
    </Step>
}

export const PositionYourselfStep = () => {
    return <Step >
        <h1>KycDAO</h1>
        <p>Lorem ipsum</p>
        <Button />
    </Step>
}

export const TakeAPhotoStep = () => {
    return <Step >
        <h1>KycDAO</h1>
        <p>Lorem ipsum</p>
        <Button />
    </Step>
}

export const CongratulationVerifiedStep = () => {
    return <Step >
        <h1>KycDAO</h1>
        <p>Lorem ipsum</p>
        <Button />
    </Step>
}

export const kycNFTArtSelectionStep = () => {
    return <Step >
        <h1>KycDAO</h1>
        <p>Lorem ipsum</p>
        <Button />
    </Step>
}

export const ChainSelectionStep = () => {
    return <Step>
        <h1>KycDAO</h1>
        <p>Lorem ipsum</p>
        <Button />
    </Step>
}

export const LastStep = () => {
    return <Step>
        <h1>KycDAO</h1>
        <p>Lorem ipsum</p>
        <Button />
    </Step>
}
