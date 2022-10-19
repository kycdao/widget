import { Countries } from "@kycdao/kycdao-sdk"
import { useState, useContext, useCallback, useMemo, useEffect } from "react"
import { Input } from "../components/input/input.component"
import { StateContext, StepID, DataActionTypes } from "../components/stateContext"
import { Step } from "../components/step"
import { SubmitButton } from "../components/submitButton/submitButton"

export const TaxResidenceStep = () => {
    const [value, setValue] = useState<string>()
    const { dispatch, data: { taxResidency } } = useContext(StateContext)
    const submitDisabled = useMemo(() => !Countries.find((c) => c.name === value), [value])
    const [taxResidence, setTaxResidence] = useState(taxResidency)

    useEffect(() => {
        console.log(taxResidency)
        if(taxResidency) {
            setValue(Countries.find((country) => country.iso_cca2 === taxResidency)?.name || '')
        }
    }, [])

    const onPrev = useCallback(() => {
        dispatch({ payload: StepID.emailDiscordVerificationStep, type: DataActionTypes.nexPage })
        dispatch({ payload: taxResidence, type: DataActionTypes.taxResidenceChange })
    }, [taxResidence])

    const onSubmit = useCallback(() => {
        if(!submitDisabled) {
            dispatch({ type: DataActionTypes.taxResidenceChange, payload: taxResidence })
            dispatch({ type: DataActionTypes.nexPage, payload: StepID.chainSelection })
            //dispatch({ type: DataActionTypes.nexPage, payload: StepID.beginVerificationStep })
        }
    }, [taxResidence, submitDisabled])

    const autoCompleteData = useMemo(() => Countries.map(c => c.name), [])

    const onChange = useCallback((newValue: string) => {
        setTaxResidence(Countries.find((country) => country.name === newValue)?.iso_cca2 || '')
        setValue(newValue)
    }, [])

    return <Step onEnter={onSubmit} prev={onPrev} footer={
        <>
            <Input autoFocus autoCompleteData={autoCompleteData} value={value} placeholder={"Type your tax residence here"} className="full-width" onChange={onChange} />
            <SubmitButton disabled={submitDisabled} className="full-width blue" onClick={onSubmit} />
        </>
    }>
        <h1 className="h1">Tax residence</h1>
        <p className="p">Please select the country where you are currently a tax residence.</p>
    </Step>
}
