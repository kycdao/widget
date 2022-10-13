import { FC, useCallback, useContext, useEffect, useState } from "react"
import { Button } from "./button/button"
import { DataActionTypes, StepID } from "./reducer"
import { StateContext } from "./stateContext"
import { Step } from "./step"
import { KycDaoContext } from "./kycDao.provider"
import { ToggleButton } from "./toggleButton/toggleButton"
import { VerificationTypes } from "@kycdao/kycdao-sdk"

type Chains = 'Near' | 'Ethereum'

const chains: { value: Chains, label: string }[] = [
    { label: 'NEAR', value: 'Near' },
    { label: 'EVM', value: 'Ethereum' }
]

export const ChainSelection: FC = () => {
    const kycDao = useContext(KycDaoContext)
    const [connectedWallet, setConnectedWallet] = useState<"Near" | "Ethereum">()

    const { dispatch, data: { termsAccepted } } = useContext(StateContext)

    const onChange = useCallback((value: Chains) => async () => {
        await kycDao?.kycDao.connectWallet(value).then(() => setConnectedWallet(value))
        // kycDao?.kycDao.
        // dispatch()
    }, [])
    
    const onPrev = useCallback(() => {
        dispatch({ type: DataActionTypes.nexPage, payload: StepID.nftArtSelection })
        // dispatch()
    }, [])
    
    const onSubmit = useCallback(async () => {
        try {
            await kycDao?.kycDao.registerOrLogin()
            await kycDao?.kycDao.startMinting({
                disclaimerAccepted: termsAccepted,
                verificationType: VerificationTypes.KYC
            })
            // kycDao?.kycDao.sess
            // await kycDao?.kycDao.startMinting({ disclaimerAccepted: true })
        } catch (err) {
            console.error(err)
        }
        dispatch({ type: DataActionTypes.nexPage, payload: StepID.finalStep })
    }, [])

    useEffect(() => {
        if(kycDao) {
            kycDao.kycDao.disconnectWallet()
        }
    }, [])

    if (!kycDao) {
        return <>Error</>
    }

    return <Step prev={onPrev} header={<h1 className="h1">Mint</h1>} footer={<>
        <Button disabled={!connectedWallet} className="full-width blue" onClick={onSubmit} />
    </>} >
        <h2 className="h2">
            Your amazing NFT image will be here, but first, please complete KYC verification!
        </h2>
        <h2 className="h2">
            Select Network
        </h2>
        {chains.map(({ label, value }) =>
            <ToggleButton label={label} toggle={ value === connectedWallet } key={value} className="full-width blue" onClick={onChange(value)} />
        )}
    </Step>
}
