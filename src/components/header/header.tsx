import { FC, useCallback, useContext } from "react"
import { DataActionTypes, HeaderButtons, StateContext } from "../stateContext"
import './header.scss'

export const Header: FC = () => {
    const { data: { closeButtonState, nextButtonState, prevButtonState }, dispatch } = useContext(StateContext)

    const onPrev = useCallback(() => {
        dispatch({ payload: { button: HeaderButtons.prev }, type: DataActionTypes.OnClickHeaderButton })
    }, [])

    const OnNext = useCallback(() => {
        dispatch({ payload: { button: HeaderButtons.next }, type: DataActionTypes.OnClickHeaderButton })
    }, [])

    const OnClose = useCallback(() => {
        dispatch({ payload: { button: HeaderButtons.close }, type: DataActionTypes.OnClickHeaderButton })
    }, [])

    return <>
        <div className="step-header">
            <div className="button-wrapper">
                <button disabled={prevButtonState === 'disabled'} className={`material-icons${prevButtonState === "hidden" ? " hidden" : '' }`} onClick={onPrev}>chevron_left</button>
                <button disabled={nextButtonState === 'disabled'} className={`material-icons${nextButtonState === "hidden" ? " hidden" : '' }`} onClick={OnNext}>chevron_right</button>
            </div>
            <button disabled={closeButtonState === 'disabled'} className={`material-icons close-button${closeButtonState === "hidden" ? " hidden" : '' }`} onClick={OnClose}>close</button>
        </div>
    </>
}
