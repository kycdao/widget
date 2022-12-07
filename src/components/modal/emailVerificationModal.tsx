import { useCallback, useContext } from "react"
import { useKycDao } from "../../hooks/useKycDao"
import { Button } from "../button/button"
import { DataActionTypes } from "../stateContext"
import { StateContext } from "../stateContext/stateContext"

export const EmailVerificationModal = () => {
	const {
		data: { email },
		dispatch,
	} = useContext(StateContext)

	const kycDao = useKycDao()

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

			<div className="e-mail-address">
				<p className="policy">
					Please verify yourself through the <b>link</b> we've sent you to the
					following address:
				</p>
				<p>{email}</p>
			</div>

			<div className="button-wrapper">
				<Button className="underline centered" onClick={onResend}>
					<>
						<i className="material-icons">refresh</i>
						<span>Resend</span>
					</>
				</Button>

				<Button className="underline centered" onClick={onChangeEmail}>
					<>
						<i className="material-icons">refresh</i>
						<span>change email</span>
					</>
				</Button>
			</div>
		</div>
	)
}
