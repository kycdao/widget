import { useContext, useCallback, FC } from "react"
import { Placeholder } from "./placeholder/placeholder"
import { StepID, DataActionTypes } from "./reducer"
import { StateContext } from "./stateContext"
import { Step } from "./step"

export const ListItem: FC<{ label: string, last?: boolean, onClick?: () => void }> = ({ label, last = false, onClick }) =>
    <>
        <Divider />
        <div onClick={onClick} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBlock: "0.5em" }}>
            <span style={{ flex: 1 }}>
                <Placeholder height="30px" width="30px" />
            </span>
            <span style={{ flex: 4, alignSelf: 'center' }}>{label}</span>
            <span style={{ flex: 1, alignSelf: 'center', paddingRight: '6px', textAlign: 'end' }} >&gt;</span>
        </div>
        { last && <Divider />}
    </>

export const Divider: FC = () =>
    <span style={{ borderTop: '1px solid', display: 'flex', marginRight: '-1em', marginLeft: '-1em' }}></span>


export const UploadIDPhotoTypeStep = () => {
    const { dispatch } = useContext(StateContext)

    const onPrev = useCallback(() => {
        dispatch({ payload: StepID.AgreementStep, type: DataActionTypes.nexPage })
    }, [])

    return <Step prev={onPrev}>
        <h1 className="h1">Upload a photo ID</h1>
        <p className="p">We require a photo of a government ID to verify your identity.</p>
        <h2 style={{ paddingBottom: '0.5em' }}>Choose 1 of the following options</h2>
        <ListItem label="Driver License" />
        <ListItem label="National ID" />
        <ListItem label="Passport" />
        <ListItem last label="Residency Permit" />
    </Step>
}
