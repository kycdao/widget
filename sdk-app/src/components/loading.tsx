import { FC } from "react"

import { Step } from "./step"

export const ChainSelection: FC = () => {
    return <Step header={<h1 className="h1">Mint</h1>}>
        <h1 className="h1">
            Verification is loading
        </h1>
        <h2 className="h2">...</h2>
    </Step>
}
