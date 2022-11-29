import { useCallback, useContext, useEffect } from "react"
import { Button } from "../button/button"
import { DataActionTypes, StepID } from "../stateContext"
import { StateContext } from "../stateContext/stateContext"
import "./emailVerificationModal.scss"

export const EmailVerificationModal = () => {
	const {
		data: { email },
		dispatch,
	} = useContext(StateContext)

	const onResend = useCallback(() => {
		console.log("resend")
	}, [])

	const onChangeEmail = useCallback(() => {
		dispatch({ type: DataActionTypes.setModal, payload: null })
	}, [dispatch])

	useEffect(() => {
		const timeout = setTimeout(() => {
			dispatch({
				type: DataActionTypes.changePage,
				payload: {
					current: StepID.taxResidenceStep,
					prev: StepID.emailDiscordVerificationStep,
				},
			})
			dispatch({
				type: DataActionTypes.setModal,
				payload: null,
			})
		}, 3000)

		return () => clearTimeout(timeout)
	}, [dispatch])

	return (
		<div className="emailVerificationModal">
			<div className="header">
				<i className="material-icons">hourglass_bottom</i>
				<p>Waiting your mail verification</p>
			</div>
			<div style={{ margin: "1em" }}>
				<p className="policy">Your email address is:</p>
				<p>{email}</p>
			</div>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					margin: "1em",
					justifyContent: "space-between",
				}}>
				<Button className="underline centered" onClick={onResend}>
					↻ resend email
				</Button>
				<Button className="underline centered" onClick={onChangeEmail}>
					change email
				</Button>
			</div>
		</div>
	)
}
