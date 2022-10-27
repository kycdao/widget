import { VerificationTypes } from "@kycdao/kycdao-sdk"
import { useContext, useState, useCallback, FC } from "react"
import { Button } from "../components/button/button"
import { KycDaoContext } from "../components/kycDao.provider"
import { Placeholder } from "../components/placeholder/placeholder"
import { StateContext, DataActionTypes, StepID, HeaderButtons } from "../components/stateContext"
import { Step, StepAnimation } from "../components/step/step"


export const NftSelection: FC<{ className?: string, animation?: StepAnimation, disabled?: boolean }> = ({ className, animation, disabled = false }) => {
    const { dispatch, data: { termsAccepted, } } = useContext(StateContext)
    const kycDao = useContext(KycDaoContext)

    const [nftImages, setNftImages] = useState([{ src: kycDao?.kycDao.getNftImageUrl(), hash: Date.now() }])

    const onSubmit = useCallback((ID: string) => async () => {
        if (kycDao) {
            try {
                dispatch({ type: DataActionTypes.changePage, payload: { current: StepID.loading, prev: StepID.nftArtSelection } })
                await kycDao.kycDao.startMinting({
                    disclaimerAccepted: termsAccepted,
                    verificationType: VerificationTypes.KYC
                })
                dispatch({ type: DataActionTypes.changePage, payload: { current: StepID.finalStep, prev: StepID.loading } })
            } catch (e: any) {
                if (e.code && e.code === 4001) {
                    dispatch({ type: DataActionTypes.changePage, payload: { current: StepID.nftArtSelection } })
                }
            }
        }
    }, [])

    const onTransitionDone = () => {
        if (!disabled) {
            dispatch({ payload: { button: HeaderButtons.prev, state: 'enabled' }, type: DataActionTypes.SetHeaderButtonState })
            dispatch({ payload: { button: HeaderButtons.next, state: 'enabled' }, type: DataActionTypes.SetHeaderButtonState })
        }
    }

    const onRegenerate = useCallback(() => {
        kycDao?.kycDao.regenerateNftImage().then(() => {
            setNftImages([{ src: kycDao.kycDao.getNftImageUrl(), hash: Date.now() }])
        })
    }, [])

    if (!kycDao) {
        return <>Error</>
    }

    return <Step onTransitionDone={onTransitionDone} animation={animation} className={className} header={() => <h1>Select your KYC NFT art</h1>} >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2em', justifyContent: 'space-around', alignContent: 'center', height: '75%' }}>
            <div onClick={onSubmit('')} style={{ cursor: 'pointer', height: "150px", width: "150px" }} >
                <img src={`${nftImages[0].src}?${nftImages[0].hash}`} />
            </div>
            <Placeholder style={{ borderRadius: '100%' }} onClick={onSubmit('')} height="150px" width="150px" />
            <Placeholder style={{ borderRadius: '100%' }} onClick={onSubmit('')} height="150px" width="150px" />
            <Placeholder style={{ borderRadius: '100%' }} onClick={onSubmit('')} height="150px" width="150px" />
        </div>
        <Button disabled={disabled} label="Regenerate ↻" className="full-width underline centered" onClick={onRegenerate} />
    </Step>
}
