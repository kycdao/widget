import { FC, useCallback, useContext } from "react"
import { Button } from "./button/button"
import { DataActionTypes, StepID } from "./reducer"
import { Select } from "./select/select"
import { StateContext } from "./stateContext"
import { Step } from "./step"
import { KycDaoContext } from "./kycDao.provider"

const chains: { value: string, label: string }[] = [
    { label: 'NEAR', value: 'Near' },
    { label: 'EVM', value: 'Ethereum' }
]

export const ChainSelection: FC = () => {
    const { kycDao } = useContext(KycDaoContext)!
    const { dispatch } = useContext(StateContext)

    const onChange = useCallback(async (value: string ) => {
        if(value !== 'Near' && value !== 'Ethereum') {
            return
        }

        await kycDao.connectWallet(value)
        // dispatch()
    }, [])

    const onSubmit = useCallback(() => {
        dispatch({ type: DataActionTypes.nexPage, payload: StepID.finalStep })
    }, [])

    return <Step header={<h1>Mint</h1>} footer={<>
        <Select onChange={onChange} values={chains} value={"test"} />
        <Button  className="full-width blue" onClick={onSubmit} />
    </>} />
}
