import { VerificationTypes } from "@kycdao/kycdao-sdk"
import { useContext, useState, useCallback, FC } from "react"
import { Button } from "../components/button/button"
import { KycDaoContext } from "../components/kycDao.provider"
import { Placeholder } from "../components/placeholder/placeholder"
import { StateContext, DataActionTypes, StepID, HeaderButtons } from "../components/stateContext"
import { Step } from "../components/step/step"
import { PageProps } from "./pageProps"


export const NftSelection: FC<PageProps> = ({ className, animation, disabled = false, inactive }) => {
    const { dispatch, data: { termsAccepted, } } = useContext(StateContext)
    const kycDao = useContext(KycDaoContext)

    const [nftImages, setNftImages] = useState([{ src: kycDao?.kycDao.getNftImageUrl(), hash: Date.now() }])

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onSubmit = useCallback((_ID: string) => async () => {
        if (kycDao) {
            try {
                dispatch({ type: DataActionTypes.changePage, payload: { current: StepID.loading, prev: StepID.nftArtSelection } })
                await kycDao.kycDao.startMinting({
                    disclaimerAccepted: termsAccepted,
                    verificationType: VerificationTypes.KYC
                })
                dispatch({ type: DataActionTypes.changePage, payload: { current: StepID.finalStep, prev: StepID.loading } })
            } catch (e: unknown) {
                if (typeof e === 'object') {
                    const f = e as Record<string, unknown>;
                    if (f.code && f.code === 4001) {
                        dispatch({ type: DataActionTypes.changePage, payload: { current: StepID.nftArtSelection } })
                    }
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

    return <Step inactive={inactive} disabled={disabled} onTransitionDone={onTransitionDone} animation={animation} className={className} header={() => <h1>Select your KYC NFT art</h1>}
        body={({ disabled, inactive }) => <>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2em', justifyContent: 'space-around', alignContent: 'center', height: '75%' }}>
                <div onClick={onSubmit('')} style={{ cursor: 'pointer', height: "150px", width: "150px" }} >
                    <img src={`${nftImages[0].src}?${nftImages[0].hash}`} />
                </div>
                <Placeholder style={{ borderRadius: '100%' }} onClick={onSubmit('')} height="150px" width="150px" />
                <Placeholder style={{ borderRadius: '100%' }} onClick={onSubmit('')} height="150px" width="150px" />
                <Placeholder style={{ borderRadius: '100%' }} onClick={onSubmit('')} height="150px" width="150px" />
            </div>
            <Button inactive={inactive} disabled={disabled} label="Regenerate ↻" className="full-width underline centered" onClick={onRegenerate}  />
        </>
        }
    >
    </Step>
}
