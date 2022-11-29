import {
	FC,
	useCallback,
	useContext,
	useEffect,
	useLayoutEffect,
	useState,
} from "react"
import { useSwipeable } from "react-swipeable"
import { StateContext } from "../stateContext/stateContext"
import "./step.scss"

export type MovingDirection = "moving-out" | "moving-in" | "moving-center"

export type StepAnimation = { from: MovingDirection; to: MovingDirection }

export type StepState = "inTransition" | "transitionDone"

const windowHeight = window.visualViewport?.height

export type StepPart = FC<{
	disabled: boolean
	inactive: boolean
	onNext?: () => void
	onPrev?: () => void
	onEnter?: () => void
	// Thanks apple
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
const isIphone = !!navigator.userAgent.match("iPhone")

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
	}, [onEnter, state, transitionState, inactive])

	const [marginBottom, setMarginBottom] = useState<string>(
		"env(keyboard-inset-height, 0px)"
	)

	const onInputBlurred = useCallback(() => {
		if (isPhantom || isIphone) {
			setMarginBottom("0px")
		}
	}, [])

	const onInputFocused = useCallback(() => {
		if (isIphone) {
			setMarginBottom(
				windowHeight ? `${windowHeight - window.innerHeight}px` : "270px"
			)
		} else if (isPhantom) {
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
		<div
			{...(!inactive && !disabled && transitionNotDone ? swipeHandlers : {})}
			className={`step${animatedClass ? ` ${animatedClass}` : ""}${
				className ? ` ${className}` : ""
			}${state.data.currentModal ? " blurred" : ""}`}
			style={{
				position: "absolute",
				display: "flex",
				paddingBottom: marginBottom,
			}}>
			{header ? (
				<div className={`step-head`}>
					{header({
						disabled,
						inactive: inactive || transitionNotDone,
						onEnter,
						onNext,
						onPrev,
						onInputBlurred,
						onInputFocused,
					})}
				</div>
			) : null}
			{body ? (
				<div className={`step-body`}>
					{body({
						disabled,
						inactive: inactive || transitionNotDone,
						onEnter,
						onNext,
						onPrev,
						onInputBlurred,
						onInputFocused,
					})}
				</div>
			) : null}
			{footer ? (
				<div className={`step-footer`}>
					{footer({
						disabled,
						inactive: inactive || transitionNotDone,
						onEnter,
						onNext,
						onPrev,
						onInputBlurred,
						onInputFocused,
					})}
				</div>
			) : null}
		</div>
	)
}
