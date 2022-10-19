import { FC, useCallback, useContext, useMemo, useState } from "react"
import { KycDaoContext } from "../components/kycDao.provider"
import { StateContext, DataActionTypes, StepID } from "../components/stateContext"
import { Step } from "../components/step/step"
import { SubmitButton } from "../components/submitButton/submitButton"
import { ToggleButton } from "../components/toggleButton/toggleButton"

type Chains = 'Near' | 'Ethereum'

export const ChainSelection: FC = () => {
    const kycDao = useContext(KycDaoContext)
    const [connectedWallet, setConnectedWallet] = useState<"Near" | "Ethereum">()

    const { dispatch } = useContext(StateContext)

    const chains = useMemo<{ value: Chains, label: string, isAvailable: boolean }[]>(() => [
        { label: 'NEAR', value: 'Near', isAvailable: true },
        { label: 'EVM', value: 'Ethereum', isAvailable: true }
    ], [kycDao])

    const onChange = useCallback((value: Chains) => async () => {
        kycDao?.kycDao.connectWallet(value).then(() => setConnectedWallet(value))
    }, [])

    const onPrev = useCallback(() => {
        dispatch({ type: DataActionTypes.changePage, payload: StepID.taxResidenceStep })
    }, [])

    const onSubmit = useCallback(async () => {
        if (connectedWallet) {
            try {
                await kycDao?.kycDao.registerOrLogin()
            } catch (err) {
                console.error(err)
            }
            dispatch({ type: DataActionTypes.changePage, payload: StepID.beginVerificationStep })
        }
    }, [connectedWallet])

    if (!kycDao) {
        return <>Error</>
    }

    return <Step onEnter={onSubmit} prev={onPrev} header={<h1 className="h1">Mint</h1>} footer={<>
        <SubmitButton disabled={!connectedWallet} className="full-width blue" onClick={onSubmit} />
    </>} >
        <h2 className="h2">
            Your amazing NFT image will be here, but first, please complete KYC verification!
        </h2>
        <h2 className="h2">
            Select Network
        </h2>
        {chains.filter(chain => chain.isAvailable).map(({ label, value }) =>
            <ToggleButton label={label} toggle={value === connectedWallet} key={value} className="full-width blue" onClick={onChange(value)} />
        )}
    </Step>
}
