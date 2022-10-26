import { Countries } from "@kycdao/kycdao-sdk"
import { useState, useContext, useCallback, useMemo, useEffect, FC } from "react"
import { Input } from "../components/input/input.component"
import { StateContext, StepID, DataActionTypes, HeaderButtons } from "../components/stateContext"
import { Step, StepAnimation } from "../components/step/step"
import { SubmitButton } from "../components/submitButton/submitButton"

export const TaxResidenceStep: FC<{ className?: string, animation?: StepAnimation, disabled?: boolean }> = ({ className, animation, disabled = false }) => {
    const [value, setValue] = useState<string>()
    const { dispatch, data: { taxResidency, onPrev, onNext } } = useContext(StateContext)
    const submitDisabled = useMemo(() => !Countries.find((c) => c.name === value), [value] || taxResidency)
    const [taxResidence, setTaxResidence] = useState(taxResidency)
    const [autoFocus, setAutoFocus] = useState(false)

    const onAnimationDone = useCallback(() => {
        setAutoFocus(true)
    }, [])

    useEffect(() => {
        if (taxResidency) {
            setValue(Countries.find((country) => country.iso_cca2 === taxResidency)?.name || '')
        }
    }, [])

    useEffect(() => {
        if (!disabled) {
            const prev = onPrev.subscribe(() => {
                dispatch({ payload: { current: StepID.emailDiscordVerificationStep, next: StepID.taxResidenceStep }, type: DataActionTypes.changePage })
                dispatch({ payload: taxResidence, type: DataActionTypes.taxResidenceChange })
            })

            const next = onNext.subscribe(onSubmit)

            return () => {
                prev.unsubscribe()
                next.unsubscribe()
            }
        }
    }, [taxResidence, disabled])

    const onSubmit = useCallback(() => {
        if (!submitDisabled) {
            dispatch({ type: DataActionTypes.taxResidenceChange, payload: taxResidence })
            dispatch({ type: DataActionTypes.changePage, payload: { current: StepID.chainSelection, prev: StepID.taxResidenceStep } })
        }
    }, [taxResidence, submitDisabled])

    const autoCompleteData = useMemo(() => Countries.map(c => c.name), [])

    const onChange = useCallback((newValue: string) => {
        setTaxResidence(Countries.find((country) => country.name === newValue)?.iso_cca2 || '')
        setValue(newValue)
    }, [])
    
    useEffect(() => {
        dispatch({ type: DataActionTypes.SetHeaderButtonState, payload: { button: HeaderButtons.next, state: submitDisabled ? 'hidden' : 'enabled' } })
    }, [submitDisabled])

    return <Step onAnimationDone={onAnimationDone} disabled={disabled} animation={animation} className={className} onEnter={onSubmit} footer={
        (disabled) =>
            <>
                <Input autoFocus={autoFocus} disabled={disabled} autoCompleteData={autoCompleteData} value={value} placeholder={"Type your tax residence here"} className="full-width" onChange={onChange} />
                <SubmitButton disabled={submitDisabled || disabled} className="full-width blue" onClick={onSubmit} />
            </>
    }>
        <h1 className="h1">Tax residence</h1>
        <p className="p">Please select the country where you are currently a tax residence.</p>
    </Step>
}
