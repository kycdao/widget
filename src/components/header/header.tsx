import { CSSProperties, FC, useCallback, useContext } from "react"
import { DataActionTypes, HeaderButtons, StateContext } from "../stateContext"
import styled from "styled-components"
import { materialIcon, tr2 } from "@/style"

const StepHeader = styled.div<{ blurred: boolean }>`
	display: flex;
	flex-flow: row;
	align-items: center;
	justify-content: space-between;
	padding: 1rem;
	position: relative;
	z-index: 10;
	filter: ${({ blurred }) => (blurred ? "brightness(50%)" : "unset")};
	background: ${({ blurred }) => (blurred ? "#fefefe" : "unset")};
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
	border-radius: var(--border-radius-light);
	${tr2};
	${materialIcon};
	${({ hidden }) => hidden && "visibility: hidden;"}
	&:hover:not([disabled]) {
		cursor: pointer;
		background: var(--kyc-cybergreen-35);
	}
	&:active:not([disabled]) {
		color: #09b678;
		cursor: pointer;
		background: var(--kyc-cybergreen-35);
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
	${tr2};
	${materialIcon};
	${({ hidden }) => hidden && "visibility: hidden;"}
	&:hover:not([disabled]) {
		background: var(--kyc-cybergreen-35);
		cursor: pointer;
	}
	&:active:not([disabled]) {
		color: var(--kyc-dark-green);
		cursor: pointer;
		background: var(--kyc-cybergreen-35);
	}
`

export const Header: FC<{ style?: CSSProperties }> = ({ style }) => {
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
		<StepHeader style={style} blurred={!!currentModal}>
			<ButtonWrapper>
				<Button
					disabled={prevButtonState === "disabled" || !!currentModal}
					hidden={prevButtonState === "hidden"}
					onClick={onPrev}>
					chevron_left
				</Button>
				<Button
					disabled={nextButtonState === "disabled" || !!currentModal}
					hidden={prevButtonState === "hidden"}
					onClick={OnNext}>
					chevron_right
				</Button>
			</ButtonWrapper>
			<CloseButton
				disabled={closeButtonState === "disabled" || !!currentModal}
				hidden={prevButtonState === "hidden"}
				onClick={OnClose}>
				close
			</CloseButton>
		</StepHeader>
	)
}
