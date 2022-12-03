import { useCallback, useContext } from "react"
import { Button } from "../button/button"
import { KycDaoContext } from "../kycDao.provider"
import { DataActionTypes } from "../stateContext"
import { StateContext } from "../stateContext/stateContext"
import "./emailVerificationModal.scss"

export const EmailVerificationModal = () => {
	const {
		data: { email },
		dispatch,
	} = useContext(StateContext)

	const kycDao = useContext(KycDaoContext)

	const onResend = useCallback(async () => {
		try {
			await kycDao?.kycDao.resendEmailConfirmationCode()
		} catch (e) {
			console.error(e)
		}

		//something to show, if it worked or not
	}, [kycDao])

	const onChangeEmail = useCallback(() => {
		dispatch({ type: DataActionTypes.setModal, payload: null })
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

			<div className="button-wrapper">

				<Button
					className="underline centered"
					onClick={onResend}
					>
					<>
						<i className="material-icons">
							refresh
						</i>
						<span>resend</span>
					</>
				</Button>

				<Button
					className="underline centered"
					onClick={onChangeEmail}
				>
					<>
						<i className="material-icons">
							refresh
						</i>
						<span>change email</span>
					</>
				</Button>

			</div>
		</div>
	)
}
