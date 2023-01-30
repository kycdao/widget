import styled from "styled-components"

export const ModalBackdrop = styled.div`
	height: 100%;
	width: 100%;
	position: absolute;
	inset: 0;
	backdrop-filter: brightness(50%);
	z-index: 10;
`

export const ModalContainer = styled.div`
	box-shadow: 0 0 0 0 rgba(white, 0);
	position: absolute;
	bottom: 0em;
	margin: 1em;
	width: stretch;
	background: #fefefe;
	border-radius: 4px;
`

export const ModalHeader = styled.div`
	box-sizing: border-box;
	flex-direction: row;
	display: flex;
	margin: 1em;
	align-items: center;
	justify-content: space-between;

	p {
		color: black;
		margin-left: 1em;
		font-family: var(--kyc-sdk-primary-font);
		margin-block: auto;
	}
`

export const ModalBody = styled.div`
	margin: 1rem;
	box-sizing: border-box;

	p {
		color: black;
		font-family: var(--kyc-sdk-primary-font);

		b {
			font-weight: 800;
			color: black;
		}
	}
`

export const CloseButton = styled.button`
	cursor: pointer;
	line-height: 100%;
	width: 2rem;
	height: 2rem;
	border: none;
	box-sizing: content-box;
	padding: 0;
	border-radius: 100%;
	background: transparent;

	&:hover {
		background: var(--kyc-sdk-cybergreen-35);
	}
`

export const HeaderIcon = styled.i<{ background?: string; color?: string }>`
	background: ${({ background }) => background};
	color: ${({ color }) => color};
	border-radius: 100%;
	height: 1.5em;
	width: 1.5em;
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;
`

export const ModalButtonWrapper = styled.div`
	box-sizing: border-box;
	padding: 0 1rem 1rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;

	.kyc-dao-web-sdk-button {
		padding: 0;
	}
`

export const HeadlineWrapper = styled.div`
	flex-direction: row;
	display: flex;
`
