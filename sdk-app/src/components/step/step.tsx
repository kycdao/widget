import { FC, PropsWithChildren, useCallback, useContext, useEffect } from "react"
import { StateContext } from "../stateContext"
import './step.scss'

type StepProps = {
    header?: JSX.Element
    footer?: JSX.Element
    next?: () => void
    prev?: () => void
    onEnter?: () => void
}

export const Step: FC<PropsWithChildren<StepProps>> = ({ children, header, footer, next, prev, onEnter }) => {
    const state = useContext(StateContext)
    const closeModal = useCallback(() => window.parent.postMessage('closeModal', 'http://localhost:5000/'), [])

    if (!state) {
        return <>Something went seriously wrong! Probably you did not provided the data! Check your data provider!</>
    }

    useEffect(() => {
        if(!onEnter) {
            return
        }

        const enterHndlr = ({key}: KeyboardEvent) => {
            if(key === 'Enter') {
                onEnter()
            }
        }

        document.addEventListener('keyup', enterHndlr)

        return () => document.removeEventListener('keyup', enterHndlr)
    }, [onEnter])

    return <div className="step-header" style={{  }}>
        <div style={{ flexDirection: 'row', justifyContent: 'space-between', display: "flex", paddingBottom: '1em' }}>
            <div className="button-wrapper">
                {/*{prev && <button className="header-button transparent" style={{ paddingLeft: 0 }} onClick={prev}>&#60;</button>}*/}
                {prev && <button className="material-icons " onClick={prev}>chevron_left</button>}
                {next && <button className="material-icons" onClick={next}>chevron_right</button>}
            </div>
            <button className="kyc-button transparent header-button" onClick={closeModal}>&times;</button>
        </div>
        <div>
            {header}
        </div>
        <div style={{ flex: '1' }} >
            {children}
        </div>
        <div style={{paddingBottom: '1em'}}>
            {footer}
        </div>
    </div>
}