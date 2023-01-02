import {
	FC,
	useCallback,
	useContext,
	useEffect,
	useLayoutEffect,
	useState,
} from "react"
import { useSwipeable } from "react-swipeable"
import { StateContext } from "@Components/stateContext/stateContext"
import styled from "styled-components"
import clsx from "clsx"

export type MovingDirection = "moving-out" | "moving-in" | "moving-center"

export type StepAnimation = { from: MovingDirection; to: MovingDirection }

export type StepState = "inTransition" | "transitionDone"

// const windowHeight = window.visualViewport?.height

export type StepPart = FC<{
	disabled: boolean
	inactive: boolean
	onNext?: () => void
	onPrev?: () => void
	onEnter?: () => void
	// Thanks apple & Phantom
	onInputFocused?: () => void
	onInputBlurred?: () => void
}>

type StepProps = {
	header?: StepPart
	footer?: StepPart
	body?: StepPart
	onEnter?: () => void
	className?: string
	disabled: boolean
	animation?: StepAnimation
	onTransitionDone?: (newState: StepState) => void
	inactive?: boolean
	onNext?: () => void
	onPrev?: () => void
}

const isPhantom = !!navigator.userAgent.match("Phantom")
// const isIphone = !!navigator.userAgent.match("iPhone")

const StyledStep = styled.div`
	display: flex;
	width: 100%;
	box-sizing: border-box;
	flex-direction: column;
	padding: 0 1em 0 1em;
	justify-content: space-between;
	align-items: center;
	right: 0;
	top: 64px;
	bottom: 0;
	position: absolute;
	transition: right 0.25s;
	overflow: hidden;

	h1 {
		font-family: var(--kyc-sdk-primary-font);
		align-items: center;
		font-weight: 400;
		display: flex;
		width: 100%;
		box-sizing: border-box;
		color: black;
	}

	&.blurred {
		filter: brightness(50%);
		background: #fefefe;
	}

	&.moving-center {
		right: 0;
	}

	&.moving-in {
		right: -100%;
	}

	&.moving-out {
		right: 100%;
	}
`

const StepHead = styled.div`
	width: 100%;
`

const StepBody = styled.div`
	box-sizing: border-box;
	align-items: stretch;
	width: 100%;
	height: 75%;
	flex-flow: column;

	p {
		font-family: var(--kyc-sdk-primary-font);
		font-weight: 400;
		color: black;
	}
`

const StepFooter = styled.div`
	padding-bottom: 1rem;
	width: 100%;
	box-sizing: border-box;
	position: relative;

	.kyc-sdk-input {
		margin: 1rem 0;
	}
`

export const Step: FC<StepProps> = ({
	onNext,
	onPrev,
	inactive = false,
	disabled = false,
	body,
	header,
	footer,
	onEnter,
	className,
	animation,
	onTransitionDone,
}) => {
	const state = useContext(StateContext)
	const [animatedClass, setAnimatedClass] = useState<MovingDirection>()
	const [transitionState, setTransitionState] = useState<
		StepState | undefined
	>()

	const swipeHandlers = useSwipeable({
		onSwipedLeft: onNext,
		onSwipedRight: onPrev,
	})

	useLayoutEffect(() => {
		if (animation) {
			setAnimatedClass(animation.from)
			setTransitionState("inTransition")
			const timeout = setTimeout(() => {
				setAnimatedClass(animation.to)
			}, 0)

			return () => clearTimeout(timeout)
		} else {
			setTransitionState("transitionDone")
			if (onTransitionDone) {
				onTransitionDone("transitionDone")
			}
		}
	}, [onTransitionDone, animation])

	useLayoutEffect(() => {
		const timeout = setTimeout(() => {
			if (animation && !!transitionState && animatedClass === animation?.to) {
				if (onTransitionDone) {
					onTransitionDone("transitionDone")
				}
				setTransitionState("transitionDone")
			}
		}, 250)

		return () => clearTimeout(timeout)
	}, [animatedClass, transitionState, onTransitionDone, animation])

	useEffect(() => {
		if (
			inactive ||
			!onEnter ||
			(transitionState && transitionState !== "transitionDone")
		) {
			return
		}

		const enterHndlr = ({ key }: KeyboardEvent) => {
			if (key === "Enter") {
				onEnter()
			}
		}

		document.addEventListener("keyup", enterHndlr)

		return () => document.removeEventListener("keyup", enterHndlr)
	}, [onEnter, transitionState, inactive])

	const [marginBottom, setMarginBottom] = useState<string>(
		"env(keyboard-inset-height, 0px)"
	)

	const onInputBlurred = useCallback(() => {
		if (isPhantom) {
			setMarginBottom("0px")
		}
	}, [])

	const onInputFocused = useCallback(() => {
		if (isPhantom) {
			setMarginBottom("200px")
		}
	}, [])

	if (!state) {
		return (
			<>
				Something went seriously wrong! Probably you did not provided the data!
				Check your data provider!
			</>
		)
	}

	const transitionNotDone = transitionState !== "transitionDone"

	return (
		<StyledStep
			{...(!inactive && !disabled && transitionNotDone ? swipeHandlers : {})}
			className={clsx(className, animatedClass, {
				blurred: state.data.currentModal,
			})}
			style={{
				paddingBottom: marginBottom,
			}}>
			{header ? (
				<StepHead>
					{header({
						disabled,
						inactive: inactive || transitionNotDone,
						onEnter,
						onNext,
						onPrev,
						onInputBlurred,
						onInputFocused,
					})}
				</StepHead>
			) : null}
			{body ? (
				<StepBody>
					{body({
						disabled,
						inactive: inactive || transitionNotDone,
						onEnter,
						onNext,
						onPrev,
						onInputBlurred,
						onInputFocused,
					})}
				</StepBody>
			) : null}
			{footer ? (
				<StepFooter>
					{footer({
						disabled,
						inactive: inactive || transitionNotDone,
						onEnter,
						onNext,
						onPrev,
						onInputBlurred,
						onInputFocused,
					})}
				</StepFooter>
			) : null}
		</StyledStep>
	)
}
