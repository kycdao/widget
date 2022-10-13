import { Countries } from "@kycdao/kycdao-sdk"
import { useContext, useCallback, useMemo, useState } from "react"
import { Button } from "./button/button"
import { Input } from "./input/input.component"
import { StepID, DataActionTypes } from "./reducer"
import { StateContext } from "./stateContext"
import { Step } from "./step"

export const TaxResidenceStep = () => {
    const [value, setValue] = useState('')
    const { dispatch } = useContext(StateContext)

    const onPrev = useCallback(() => {
        dispatch({ payload: StepID.AgreementStep, type: DataActionTypes.nexPage })
    }, [])


    const onSubmit = useCallback(() => {
        dispatch({ type: DataActionTypes.taxResidenceChange, payload: value })
        dispatch({ type: DataActionTypes.nexPage, payload: StepID.nftArtSelection })
        //dispatch({ type: DataActionTypes.nexPage, payload: StepID.beginVerificationStep })
    }, [])

    const autoCompleteData = useMemo(() => Countries.map(c => c.name), [])

    const submitDisabled = useMemo(() => !Countries.find((c) => c.name === value), [value])

    return <Step prev={onPrev} footer={
        <>
            <Input autoCompleteData={autoCompleteData} value={value} placeholder={"Type your tax residence here"} className="full-width" onChange={setValue} />
            <Button disabled={submitDisabled} className="full-width blue" onClick={onSubmit} />
        </>
    }>
        <h1 className="h1">Tax residence</h1>
        <p className="p">Please select the country where you are currently a tax residence.</p>
    </Step>
}
