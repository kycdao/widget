import { useContext, useCallback } from "react"
import { StateContext } from "../components/stateContext"
import { Step } from "../components/step"
import { Button } from "../components/button/button"
import { Placeholder } from "./placeholder/placeholder"

export const FinalStep = () => {
    const { data } = useContext(StateContext)

    const onCheck = useCallback(() => {
        // dispatch({ type: DataActionTypes.nexPage, payload: StepID.finalStep })
    }, [])

    return <Step header={<h1>Congrats!</h1>}>
        <h2 style={{ padding: '2em', textAlign: 'center' }}>You have successfully minted your kycNFT on {}</h2>
        <Placeholder width="300px" height="300px" style={{ margin: 'auto' }}/>
        <Button hideArrow label="Check on chain" hoverLabel="Check on chain" className="full-width underline centered" onClick={onCheck} />
    </Step>
}
