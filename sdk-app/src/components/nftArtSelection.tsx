import { useContext, useCallback, useEffect, useState } from "react"
import { StateContext } from "../components/stateContext"
import { Step } from "../components/step"
import { DataActionTypes, StepID } from "../components/reducer"
import { Button } from "../components/button/button"
import { Placeholder } from "./placeholder/placeholder"
import { KycDaoContext } from "./kycDao.provider"

export const NftSelection = () => {
    const { dispatch } = useContext(StateContext)
    const { kycDao } = useContext(KycDaoContext)!

    const [nftImages, setNftImages] = useState([])

    useEffect(() => {
        
    }, [])

    const onSubmit = useCallback((ID: string) => () => {
        dispatch({ type: DataActionTypes.nexPage, payload: StepID.chainSelection })
    }, [])

    const onRegenerate = useCallback(() => {
        kycDao.regenerateNftImage()
        // dispatch({ type: DataActionTypes.nexPage, payload: StepID.finalStep })
    }, [])

    return <Step header={<h1>Select your KYC NFT art</h1>}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2em', justifyContent: 'space-around', alignContent: 'center', height: '75%' }}>
            <Placeholder onClick={onSubmit('')} height="150px" width="150px" />
            <Placeholder onClick={onSubmit('')} height="150px" width="150px" />
            <Placeholder onClick={onSubmit('')} height="150px" width="150px" />
            <Placeholder onClick={onSubmit('')} height="150px" width="150px" />
        </div>
        <Button hideArrow label="Regenerate ↻" hoverLabel="Regenerate ↻" className="full-width underline centered" onClick={onRegenerate} />
    </Step>
}
