import { CSSProperties, FC, useCallback, useContext } from "react"
import { DataActionTypes, HeaderButtons, StateContext } from "../stateContext"
import "./header.scss"

export const Header: FC<{ style?: CSSProperties }> = ({ style }) => {
	const {
		data: { closeButtonState, nextButtonState, prevButtonState, currentModal },
		dispatch,
	} = useContext(StateContext)

	const onPrev = useCallback(() => {
		dispatch({
			payload: { button: HeaderButtons.prev },
			type: DataActionTypes.OnClickHeaderButton,
		})
	}, [dispatch])

	const OnNext = useCallback(() => {
		dispatch({
			payload: { button: HeaderButtons.next },
			type: DataActionTypes.OnClickHeaderButton,
		})
	}, [dispatch])

	const OnClose = useCallback(() => {
		dispatch({
			payload: { button: HeaderButtons.close },
			type: DataActionTypes.OnClickHeaderButton,
		})
	}, [dispatch])

	return (
		<div
			style={style}
			className={`step-header${currentModal ? " blurred" : ""}`}>
			<div className="button-wrapper">
				<button
					disabled={prevButtonState === "disabled"}
					className={`material-icons${
						prevButtonState === "hidden" ? " hidden" : ""
					}`}
					onClick={onPrev}>
					chevron_left
				</button>
				<button
					disabled={nextButtonState === "disabled"}
					className={`material-icons${
						nextButtonState === "hidden" ? " hidden" : ""
					}`}
					onClick={OnNext}>
					chevron_right
				</button>
			</div>
			<button
				disabled={closeButtonState === "disabled"}
				className={`material-icons close-button${
					closeButtonState === "hidden" ? " hidden" : ""
				}`}
				onClick={OnClose}>
				close
			</button>
		</div>
	)
}
