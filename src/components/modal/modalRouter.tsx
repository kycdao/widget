import { StateContext } from "@Components/stateContext"
import { FC, useContext } from "react"
import { EmailVerificationModal } from "./emailVerificationModal"
import { GenericErrorModal } from "./genericErrorModal"
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

		case "genericError": {
			return <GenericErrorModal />
		}

		default:
			return null
	}
}
