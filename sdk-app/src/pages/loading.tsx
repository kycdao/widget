import { FC } from "react"
import { Step } from "../components/step/step"

export const Loading: FC = () => {
    return <Step header={<h1 className="h1">Loading</h1>}>
        <h1 className="h1">
            Loading
        </h1>
        <h2 className="h2">...</h2>
    </Step>
}
