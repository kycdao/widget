import { FC, PropsWithChildren, useCallback, useContext } from "react"
import { StateContext } from "./stateContext"

type StepProps = {
    header?: JSX.Element
    footer?: JSX.Element
    next?: () => void
    prev?: () => void
}

export const Step: FC<PropsWithChildren<StepProps>> = ({ children, header, footer, next, prev }) => {
    const state = useContext(StateContext)
    const closeModal = useCallback(() => window.parent.postMessage('closeModal', 'http://localhost:5000/'), [])

    if (!state) {
        return <>Something went seriously wrong! Probably you didn't provided the data! Check your data provider!</>
    }

    return <div style={{ display: 'flex', flexDirection: 'column', padding: "2em", justifyContent: 'space-between', height: '586px' }}>
        <div style={{ flexDirection: 'row', justifyContent: 'space-between', display: "flex" }}>
            <div>
                <button onClick={next}>&#60;</button>
                <button onClick={prev}>&#62;</button>
            </div>
            <button onClick={closeModal}>&times;</button>
        </div>
        <div>
            {header}
        </div>
        <div style={{ flex: '1' }} >
            {children}
        </div>
        <div>
            {footer}
        </div>
    </div>
}