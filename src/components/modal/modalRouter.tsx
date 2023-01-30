import { StateContext } from "@Components/stateContext"
import { FC, useContext } from "react"
import { ModalBackdrop } from "./common"
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
			return (
				<ModalBackdrop>
					<EmailVerificationModal />
				</ModalBackdrop>
			)
		}

		case "minting": {
			return (
				<ModalBackdrop>
					<MintingModal />
				</ModalBackdrop>
			)
		}

		case "mintingFailed": {
			return (
				<ModalBackdrop>
					<MintingFailedModal />
				</ModalBackdrop>
			)
		}

		case "genericError": {
			return (
				<ModalBackdrop>
					<GenericErrorModal />
				</ModalBackdrop>
			)
		}

		default:
			return null
	}
}
