import { FC } from "react"
import { Step } from "./step"

const Chain: FC<{name: string}> = ({ name }) => {
    return <div>
        {name}
    </div>
}

export const ChainSelectionStep: FC = () => {
    return <Step>
        <Chain name="near"/>
        <Chain name="meta"/>
    </Step>
}
