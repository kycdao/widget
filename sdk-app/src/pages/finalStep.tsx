import { useContext, useCallback, useState, useEffect } from "react"
import { Step } from "../components/step/step"
import { Button } from "../components/button/button"
import { KycDaoContext } from "../components/kycDao.provider"
import { Placeholder } from "../components/placeholder/placeholder"

export const FinalStep = () => {
    const kycDao = useContext(KycDaoContext)

    const [nftImageUrl, setNftImageUrl] = useState('')

    const onCheck = useCallback(() => {
        // dispatch({ type: DataActionTypes.nexPage, payload: StepID.finalStep })
    }, [])

    if (!kycDao) {
        return <>error</>
    }

    useEffect(() => {
        setNftImageUrl(kycDao.kycDao.getNftImageUrl())
    }, [])

    return <Step header={<h1>Congrats!</h1>}>
        <h2 style={{ textAlign: 'center' }}>You have successfully minted your kycNFT on { kycDao.kycDao.connectedWallet?.blockchainNetwork }</h2>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            {nftImageUrl ? <img src={nftImageUrl} width="300px" height="300px" /> : <Placeholder width="300px" height="300px" />}
        </div>
        <Button label="Check on chain" className="full-width underline centered" onClick={onCheck} />
    </Step>
}
