import { useCallback, useContext } from "react"
import { useKycDao } from "@Hooks/useKycDao"
import { Button } from "../button/button"
import { DataActionTypes } from "../stateContext"
import { StateContext } from "../stateContext/stateContext"

import modalClasses from "./_modal.module.scss"

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
		<div className={modalClasses["kyc-dao-web-sdk-modal"]}>
			<div className={modalClasses["kyc-dao-web-sdk-header"]}>
				<i className="material-icons icon">hourglass_bottom</i>
				<p>Waiting your mail verification</p>
			</div>

			<div className={modalClasses["kyc-dao-web-sdk-body"]}>
				<p className={"policy"}>
					Please verify yourself through the <b>link</b> we have sent you to the
					following address:
				</p>
				<p>{email}</p>
			</div>

			<div className={modalClasses["kyc-dao-web-sdk-button-wrapper"]}>
				<Button underline centered onClick={onResend}>
					<>
						<i className="material-icons">refresh</i>
						<span>Resend</span>
					</>
				</Button>

				<Button underline centered onClick={onChangeEmail}>
					<>
						<i className="material-icons">refresh</i>
						<span>change email</span>
					</>
				</Button>
			</div>
		</div>
	)
}
