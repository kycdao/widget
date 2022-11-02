import { FC, useContext } from "react"
import { DataActionTypes, HeaderButtons, StateContext } from "../components/stateContext"
import { Step } from "../components/step/step"
import { PageProps } from "./pageProps"

export const Loading: FC<PageProps> = ({className, animation, disabled = false}) => {
    const { dispatch } = useContext(StateContext)

    const onTransitionDone = () => {
        if (!disabled) {
            dispatch({ payload: { button: HeaderButtons.prev, state: 'hidden' }, type: DataActionTypes.SetHeaderButtonState })
            dispatch({ payload: { button: HeaderButtons.next, state: 'hidden' }, type: DataActionTypes.SetHeaderButtonState })
        }
    }

    return <Step disabled={disabled} onTransitionDone={onTransitionDone} className={className} animation={animation} header={() => <h1 className="h1">Loading</h1>}>
        <h1 className="h1">
        </h1>
        <h2 className="h2">...</h2>
    </Step>
}
