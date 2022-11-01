import { Countries } from "@kycdao/kycdao-sdk"
import { useState, useContext, useCallback, useMemo, useEffect, FC } from "react"
import { Input } from "../components/input/input.component"
import { StateContext, StepID, DataActionTypes, HeaderButtons, OnNext, OnPrev } from "../components/stateContext"
import { Step } from "../components/step/step"
import { SubmitButton } from "../components/submitButton/submitButton"
import { PageProps } from "./pageProps"

export const TaxResidenceStep: FC<PageProps> = ({ className, animation, disabled = false, inactive }) => {
    const [value, setValue] = useState<string>()
    const { dispatch, data: { taxResidency } } = useContext(StateContext)
    const submitDisabled = useMemo(() => !Countries.find((c) => c.name === value), [value])
    const [taxResidence, setTaxResidence] = useState(taxResidency)

    const onTransitionDone = useCallback(() => {
        if (!disabled && !inactive) {
            dispatch({ payload: { button: HeaderButtons.prev, state: 'enabled' }, type: DataActionTypes.SetHeaderButtonState })
            dispatch({ payload: { button: HeaderButtons.next, state: 'hidden' }, type: DataActionTypes.SetHeaderButtonState })
        }
        if (taxResidency) {
            setValue(Countries.find((country) => country.iso_cca2 === taxResidency)?.name || '')
            dispatch({ type: DataActionTypes.SetHeaderButtonState, payload: { button: HeaderButtons.next, state: 'enabled' } })
        }
    }, [])

    const onSubmit = useCallback(() => {
        if (!submitDisabled && !inactive) {
            dispatch({ type: DataActionTypes.taxResidenceChange, payload: taxResidence })
            dispatch({ type: DataActionTypes.changePage, payload: { current: StepID.chainSelection, prev: StepID.taxResidenceStep } })
        }
    }, [taxResidence, submitDisabled, inactive])

    useEffect(() => {
        if (!disabled && !inactive) {
            const prev = OnPrev.subscribe(() => {
                dispatch({ payload: { current: StepID.emailDiscordVerificationStep, next: StepID.taxResidenceStep }, type: DataActionTypes.changePage })
                dispatch({ payload: taxResidence, type: DataActionTypes.taxResidenceChange })
            })

            const next = OnNext.subscribe(onSubmit)

            return () => {
                prev.unsubscribe()
                next.unsubscribe()
            }
        }
    }, [onSubmit])

    const autoCompleteData = useMemo(() => Countries.map(c => c.name), [])

    const onChange = useCallback((newValue: string) => {
        setTaxResidence(Countries.find((country) => country.name === newValue)?.iso_cca2 || '')
        setValue(newValue)
    }, [])

    useEffect(() => {
        dispatch({ type: DataActionTypes.SetHeaderButtonState, payload: { button: HeaderButtons.next, state: submitDisabled ? 'hidden' : 'enabled' } })
    }, [submitDisabled])

    return <Step inactive={inactive} onTransitionDone={onTransitionDone} disabled={disabled} animation={animation} className={className} onEnter={onSubmit} footer={
        ({ disabled, inactive }) =>
            <>
                <Input autoFocus={submitDisabled && !inactive} disabled={disabled} autoCompleteData={autoCompleteData} value={value} placeholder={"Type your tax residence here"} className="full-width" onChange={onChange} />
                <SubmitButton inactive={inactive} autoFocus={!submitDisabled && !inactive} disabled={submitDisabled || disabled} className="full-width blue" onClick={onSubmit} />
            </>
    }>
        <h1 className="h1">Tax residence</h1>
        <p className="p">Please select the country where you are currently a tax residence.</p>
    </Step>
}