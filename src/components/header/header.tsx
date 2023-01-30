import {
	DataActionTypes,
	HeaderButtons,
	StateContext,
} from "@Components/stateContext"
import { materialIcon, tr2 } from "@Components/typography"
import { FC, useCallback, useContext } from "react"
import styled from "styled-components"

const StepHeader = styled.div`
	display: flex;
	flex-flow: row;
	align-items: center;
	justify-content: space-between;
	padding: 1rem;
	position: relative;
	z-index: 10;
	background: #fefefe;
`

const ButtonWrapper = styled.div`
	display: flex;
	align-items: center;
	margin-left: -0.5rem;
`

const Button = styled.button<{ hidden?: boolean }>`
	width: 2rem;
	height: 2rem;
	background: none;
	border: none;
	color: black;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: var(--kyc-sdk-border-radius-light);
	${tr2};
	${materialIcon};

	${({ hidden }) =>
		hidden && {
			opacity: "0.3",
		}}

	&:hover:enabled:not([hidden]) {
		cursor: pointer;
		background: var(--kyc-sdk-cybergreen-35);
	}

	&:active:enabled:not([hidden]) {
		color: #09b678;
		cursor: pointer;
		background: var(--kyc-sdk-cybergreen-35);
	}
`

const CloseButton = styled.button<{ hidden?: boolean }>`
	border: none;
	background: transparent;
	align-items: center;
	display: flex;
	width: 2rem;
	height: 2rem;
	justify-content: center;
	border-radius: 999rem;
	font-size: 24px;
	color: black;
	box-sizing: content-box;
	padding: 0;
	${tr2};
	${materialIcon};

	${({ hidden }) =>
		hidden && {
			visibility: "hidden",
		}}

	&:hover:enabled:not([hidden]) {
		background: var(--kyc-sdk-cybergreen-35);
		cursor: pointer;
	}

	&:active:enabled:not([hidden]) {
		color: var(--kyc-sdk-dark-green);
		cursor: pointer;
		background: var(--kyc-sdk-cybergreen-35);
	}
`

export const Header: FC = () => {
	const {
		data: { closeButtonState, nextButtonState, prevButtonState, currentModal },
		dispatch,
	} = useContext(StateContext)

	const onPrev = useCallback(() => {
		dispatch({
			payload: { button: HeaderButtons.prev },
			type: DataActionTypes.OnClickHeaderButton,
		})
	}, [dispatch])

	const OnNext = useCallback(() => {
		dispatch({
			payload: { button: HeaderButtons.next },
			type: DataActionTypes.OnClickHeaderButton,
		})
	}, [dispatch])

	const OnClose = useCallback(() => {
		dispatch({
			payload: { button: HeaderButtons.close },
			type: DataActionTypes.OnClickHeaderButton,
		})
	}, [dispatch])

	return (
		<StepHeader>
			<ButtonWrapper>
				<Button
					disabled={prevButtonState === "disabled" || !!currentModal}
					hidden={prevButtonState === "hidden"}
					onClick={onPrev}>
					chevron_left
				</Button>
				<Button
					disabled={nextButtonState === "disabled" || !!currentModal}
					hidden={nextButtonState === "hidden"}
					onClick={OnNext}>
					chevron_right
				</Button>
			</ButtonWrapper>
			<CloseButton
				disabled={closeButtonState === "disabled" || !!currentModal}
				hidden={closeButtonState === "hidden"}
				onClick={OnClose}>
				close
			</CloseButton>
		</StepHeader>
	)
}
