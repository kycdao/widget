import { ModalData, StateContext } from "@Components/stateContext"
import { FC, useContext } from "react"
import { ModalBackdrop } from "./common"
import { EmailVerificationModal } from "./emailVerificationModal"
import { GenericModal } from "./genericErrorModal"
import { MintingFailedModal } from "./mintingFailed"
import { MintingModal } from "./mintingModal"

function RenderModal(type?: ModalData["type"]) {
	if (!type) {
		return
	}

	switch (type) {
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
					<GenericModal mode="error" />
				</ModalBackdrop>
			)
		}

		case "genericInfo": {
			return (
				<ModalBackdrop>
					<GenericModal mode="info" />
				</ModalBackdrop>
			)
		}

		default:
			return null
	}
}

export const ModalRouter: FC = () => {
	const {
		data: { modal },
	} = useContext(StateContext)

	return modal ? (
		<ModalBackdrop>
			{RenderModal(typeof modal === "string" ? modal : modal?.type)}
		</ModalBackdrop>
	) : null
}
