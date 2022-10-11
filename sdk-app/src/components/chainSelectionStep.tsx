import { FC, useCallback, useContext } from "react"
import { Button } from "./button/button"
import { DataActionTypes, StepID } from "./reducer"
import { Select } from "./select/select"
import { StateContext } from "./stateContext"
import { Step } from "./step"


export const ChainSelection: FC = () => {
    const { dispatch } = useContext(StateContext)

    const onChange = useCallback((value: string) => {

    }, [])

    const onSubmit = useCallback(() => {
        dispatch({ type: DataActionTypes.nexPage, payload: StepID.finalStep })
    }, [])

    return <Step header={<h1>Mint</h1>} footer={<>
        <Select onChange={onChange} values={[]} value={"test"} />
        <Button className="full-width blue" onClick={onSubmit} />
    </>} />
}
