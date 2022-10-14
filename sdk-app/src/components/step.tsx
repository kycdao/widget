import { FC, PropsWithChildren, useCallback, useContext, useEffect } from "react"
import { StateContext } from "./stateContext"

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

    return <div style={{ display: 'flex', flexDirection: 'column', padding: "1em", justifyContent: 'space-between', height: '650px', paddingTop: 0, paddingBottom: 0 }}>
        <div style={{ flexDirection: 'row', justifyContent: 'space-between', display: "flex", paddingBottom: '1em' }}>
            <div>
                {prev && <button className="kyc-button transparent header-button" style={{ paddingLeft: 0 }} onClick={prev}>&#60;</button>}
                {next && <button className="kyc-button transparent header-button" onClick={next}>&#62;</button>}
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