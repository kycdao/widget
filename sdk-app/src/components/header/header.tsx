import { FC, useCallback, useContext } from "react"
import { DataActionTypes, HeaderButtons, StateContext } from "../stateContext"
import './header.scss'

export const Header: FC = () => {
    const { data: { closeButtonState, prevButtonState, nextButtonState }, dispatch } = useContext(StateContext)

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
                {prevButtonState !== "hidden" && <button disabled={prevButtonState === 'disabled'} className="material-icons" onClick={onPrev}>chevron_left</button>}
                {nextButtonState !== "hidden" && <button disabled={nextButtonState === 'disabled'} className="material-icons" onClick={OnNext}>chevron_right</button>}
            </div>
            {closeButtonState !== 'hidden' && <button disabled={closeButtonState === 'disabled'} className="close-button" onClick={OnClose}>&times;</button>}
        </div>
    </>
}
