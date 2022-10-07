import { Children, createContext, FC, PropsWithChildren, useCallback, useContext, useReducer } from "react"
import { Step } from "../components/step"
import { DataActionTypes } from "../components/reducer"

export type ButtonProps = {
    onClick?: () => void
    label?: string
}

export const Submit: FC<PropsWithChildren<ButtonProps>> = ({ onClick, label }) => {
    return <button type="button" onClick={onClick}>{label}</button>
}

export const KycDAOMembershipStep: FC = () => {
    return <Step >
        <h1>Guild and KycDAO</h1>
        <p>Lorem ipsum</p>
        <Submit label="ok" />
    </Step>
}

export const VerificationStep = () => {
    return <Step >
        <h1>Guild and KycDAO</h1>
        <p>Lorem ipsum</p>
        <Submit />
    </Step>
}

export const EmailDiscordVerificationStep = () => {
    return <Step >
        <h1>Guild and KycDAO</h1>
        <p>Lorem ipsum</p>
        <Submit />
    </Step>
}

export const TaxResidenceStep = () => {
    return <Step >
        <h1>Guild and KycDAO</h1>
        <p>Lorem ipsum</p>
        <Submit />
    </Step>
}

export const BeginVerifyingStep = () => {
    return <Step >
        <h1>Guild and KycDAO</h1>
        <p>Lorem ipsum</p>
        <Submit />
    </Step>
}

export const GovernmentIDSelectionStep = () => {
    return <Step >
        <h1>Guild and KycDAO</h1>
        <p>Lorem ipsum</p>
        <Submit />
    </Step>
}

export const UploadIDPhotoTypeStep = () => {
    return <Step >
        <h1>Guild and KycDAO</h1>
        <p>Lorem ipsum</p>
        <Submit />
    </Step>
}

export const UploadIDPhotoStep = () => {
    return <Step >
        <h1>Guild and KycDAO</h1>
        <p>Lorem ipsum</p>
        <Submit />
    </Step>
}

export const TakePhotoStep = () => {
    return <Step >
        <h1>Guild and KycDAO</h1>
        <p>Lorem ipsum</p>
        <Submit />
    </Step>
}

export const ProcessingStep = () => {
    return <Step >
        <h1>Guild and KycDAO</h1>
        <p>Lorem ipsum</p>
        <Submit />
    </Step>
}

export const PositionYourselfStep = () => {
    return <Step >
        <h1>Guild and KycDAO</h1>
        <p>Lorem ipsum</p>
        <Submit />
    </Step>
}

export const TakeAPhotoStep = () => {
    return <Step >
        <h1>Guild and KycDAO</h1>
        <p>Lorem ipsum</p>
        <Submit />
    </Step>
}

export const CongratulationVerifiedStep = () => {
    return <Step >
        <h1>Guild and KycDAO</h1>
        <p>Lorem ipsum</p>
        <Submit />
    </Step>
}

export const kycNFTArtSelectionStep = () => {
    return <Step >
        <h1>Guild and KycDAO</h1>
        <p>Lorem ipsum</p>
        <Submit />
    </Step>
}

export const ChainSelectionStep = () => {
    return <Step>
        <h1>Guild and KycDAO</h1>
        <p>Lorem ipsum</p>
        <Submit />
    </Step>
}

export const LastStep = () => {
    return <Step>
        <h1>Guild and KycDAO</h1>
        <p>Lorem ipsum</p>
        <Submit />
    </Step>
}
