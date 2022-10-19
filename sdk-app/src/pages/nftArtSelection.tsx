import { VerificationTypes } from "@kycdao/kycdao-sdk"
import { useContext, useState, useCallback } from "react"
import { Button } from "../components/button/button"
import { KycDaoContext } from "../components/kycDao.provider"
import { Placeholder } from "../components/placeholder/placeholder"
import { StateContext, DataActionTypes, StepID } from "../components/stateContext"
import { Step } from "../components/step"


export const NftSelection = () => {
    const { dispatch, data: {  termsAccepted, } } = useContext(StateContext)
    const kycDao = useContext(KycDaoContext)

    const [nftImages, setNftImages] = useState([{ src: kycDao?.kycDao.getNftImageUrl(), hash: Date.now()}])

    const onSubmit = useCallback((ID: string) => async () => {
        if(kycDao) {
            try {
                dispatch({ type: DataActionTypes.changePage, payload: StepID.loading })
                await kycDao.kycDao.startMinting({
                    disclaimerAccepted: termsAccepted,
                    verificationType: VerificationTypes.KYC
                })
                dispatch({ type: DataActionTypes.changePage, payload: StepID.finalStep })
            } catch(e: any) {
                if(e.code && e.code === 4001) {
                    dispatch({ type: DataActionTypes.changePage, payload: StepID.nftArtSelection })
                }
            }
        }
    }, [])

    const onRegenerate = useCallback(() => {
        kycDao?.kycDao.regenerateNftImage().then(() => {
            setNftImages([{ src: kycDao.kycDao.getNftImageUrl(), hash: Date.now()}])
        })
    }, [])

    if (!kycDao) {
        return <>Error</>
    }

    return <Step header={<h1>Select your KYC NFT art</h1>}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2em', justifyContent: 'space-around', alignContent: 'center', height: '75%' }}>
            <div onClick={onSubmit('')} style={{ cursor: 'pointer', height: "150px", width: "150px" }} >
                <img src={`${nftImages[0].src}?${nftImages[0].hash}`} />
            </div>
            <Placeholder style={{ borderRadius: '100%' }} onClick={onSubmit('')} height="150px" width="150px" />
            <Placeholder style={{ borderRadius: '100%' }} onClick={onSubmit('')} height="150px" width="150px" />
            <Placeholder style={{ borderRadius: '100%' }} onClick={onSubmit('')} height="150px" width="150px" />
        </div>
        <Button label="Regenerate ↻" className="full-width underline centered" onClick={onRegenerate} />
    </Step>
}
