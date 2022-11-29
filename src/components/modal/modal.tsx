import { FC, useContext } from "react"
import { StateContext } from "../stateContext/stateContext"
import { EmailVerificationModal } from "./emailVerificationModal"

export const ModalRouter: FC = () => {
	const {
		data: { currentModal },
	} = useContext(StateContext)

	switch (currentModal) {
		case "emailVerification": {
			return <EmailVerificationModal />
		}

		default:
			return null
	}
}
