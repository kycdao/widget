import { FC, useContext } from "react"
import { StateContext } from "../stateContext/stateContext"
import { EmailVerificationModal } from "./emailVerificationModal"
import { MintingFailedModal } from "./mintingFailed"
import { MintingModal } from "./mintingModal"

export const ModalRouter: FC = () => {
	const {
		data: { currentModal },
	} = useContext(StateContext)

	switch (currentModal) {
		case "emailVerification": {
			return <EmailVerificationModal />
		}

		case "minting": {
			return <MintingModal />
		}

		case "mintingFailed": {
			return <MintingFailedModal />
		}

		default:
			return null
	}
}
