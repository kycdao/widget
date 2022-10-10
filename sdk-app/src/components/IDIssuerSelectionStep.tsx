import { useContext, useCallback, useState } from "react"
import { Button } from "./button/button"
import { StepID, DataActionTypes } from "./reducer"
import { Select } from "./select/select"
import { Option } from "./select/option"
import { StateContext } from "./stateContext"
import { Step } from "./step"

export const IDIssuerSelectionStep = () => {
    const { dispatch, data } = useContext(StateContext)

    const onPrev = useCallback(() => {
        dispatch({ payload: StepID.AgreementStep, type: DataActionTypes.nexPage })
    }, [])

    const onSubmit = useCallback(() => {
        dispatch({ type: DataActionTypes.nexPage, payload: StepID.UploadIDPhotoTypeStep })
    }, [])

    const onChange = useCallback((value: string) => {
        dispatch({ type: DataActionTypes.idIssuerChange, payload: value })
        console.log(value)
    }, [])

    return <Step prev={onPrev} footer={
        <>
            <Button className="full-width blue" onClick={onSubmit}/>
        </>
    }>
        <h1 className="h1">What country is your government ID from?</h1>
        <p className="p">This helps us determine the best way to verify your identity.</p>
        <Select values={[{ label: 'Hungary', value: 'hu' }, { label: 'Germany', value: 'ge' }]} onChange={onChange} value={data.idIssuer} />
    </Step>
}
