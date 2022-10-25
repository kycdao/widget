import { FC } from "react"
import { Step, StepAnimation } from "../components/step/step"

export const Loading: FC<{className?: string, animation?: StepAnimation}> = ({className, animation}) => {
    return <Step className={className} animation={animation} header={() => <h1 className="h1">Loading</h1>}>
        <h1 className="h1">
            Loading
        </h1>
        <h2 className="h2">...</h2>
    </Step>
}
