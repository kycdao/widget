import { Countries } from "@kycdao/kycdao-sdk"
import { useContext, useCallback, useMemo, useState } from "react"
import { Button } from "./button/button"
import { Input } from "./input/input.component"
import { StepID, DataActionTypes } from "./reducer"
import { StateContext } from "./stateContext"
import { Step } from "./step"

export const TaxResidenceStep = () => {
    const [value, setValue] = useState('')
    const [taxResidence, setTaxResidence] = useState('')
    const { dispatch } = useContext(StateContext)

    const onPrev = useCallback(() => {
        dispatch({ payload: StepID.AgreementStep, type: DataActionTypes.nexPage })
    }, [])

    const onSubmit = useCallback(() => {
        dispatch({ type: DataActionTypes.taxResidenceChange, payload: taxResidence })
        dispatch({ type: DataActionTypes.nexPage, payload: StepID.chainSelection })
        //dispatch({ type: DataActionTypes.nexPage, payload: StepID.beginVerificationStep })
    }, [taxResidence])

    const autoCompleteData = useMemo(() => Countries.map(c => c.name), [])

    const submitDisabled = useMemo(() => !Countries.find((c) => c.name === value), [value])

    const onChange = useCallback((newValue: string) => {
        setTaxResidence(Countries.find((country) => country.name === newValue)?.iso_cca2 || '')
        setValue(newValue)
    }, [])

    return <Step prev={onPrev} footer={
        <>
            <Input autoCompleteData={autoCompleteData} value={value} placeholder={"Type your tax residence here"} className="full-width" onChange={onChange} />
            <Button disabled={submitDisabled} className="full-width blue" onClick={onSubmit} />
        </>
    }>
        <h1 className="h1">Tax residence</h1>
        <p className="p">Please select the country where you are currently a tax residence.</p>
    </Step>
}
