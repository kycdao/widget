import { useContext, useCallback, FC } from "react"
import { Button } from "./button/button"
import { StepID, DataActionTypes } from "./reducer"
import { StateContext } from "./stateContext"
import { Step } from "./step"

export const ListItem: FC<{label: string}> = ({label}) => {
    return <div>
        <div></div>
        <div>{label}</div>
        <div>&gt;</div>
    </div>
}

export const UploadIDPhotoTypeStep = () => {
    const { dispatch } = useContext(StateContext)

    const onPrev = useCallback(() => {
        dispatch({ payload: StepID.AgreementStep, type: DataActionTypes.nexPage })
    }, [])

    const onSelect = useCallback(() => {
        dispatch({ payload: StepID.AgreementStep, type: DataActionTypes.nexPage })
    }, [])

    return <Step prev={onPrev} footer={
            <Button className="full-width blue" onClick={onSelect}/>
    }>
        <h1 className="h1">Upload a photo ID</h1>
        <p className="p">We require a photo of a government ID to verify your identity.</p>
        <h2>Choose 1 of the following options</h2>
        <ListItem label="Driver License" />
        <ListItem label="National ID" />
        <ListItem label="Passport" />
        <ListItem label="Residency Permit" />
    </Step>
}
