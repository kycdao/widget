import { Loading } from "@Components/loading/loading"
import { H1, P, Policy } from "@Style/index"
import { HeaderIcon, ModalBody, ModalContainer, ModalHeader } from "./common"
import styled from "styled-components"

const MintingModalLoading = styled(H1)`
	justify-content: center;
	display: flex;
	margin-bottom: 1em;
`

export const MintingModal = () => {
	return (
		<ModalContainer>
			<ModalHeader>
				<HeaderIcon background="green" className="material-icons">
					error
				</HeaderIcon>
				<P>Mint authorization in progress</P>
			</ModalHeader>

			<ModalBody>
				{/* TODO: KYC-697 && KYC-701  */}
				<Policy>
					Your kycNFT is getting ready! It may take up to a minute, please hold
					tight. Once authorized, it’s your turn to mint.
				</Policy>
			</ModalBody>
			<Loading />
			<MintingModalLoading>Loading</MintingModalLoading>
		</ModalContainer>
	)
}
