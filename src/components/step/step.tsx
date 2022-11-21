import {
	FC,
	PropsWithChildren,
	useContext,
	useEffect,
	useLayoutEffect,
	useState,
} from "react"
import { useSwipeable } from "react-swipeable"
import { StateContext } from "../stateContext"
import "./step.scss"

export type MovingDirection = "moving-out" | "moving-in" | "moving-center"

export type StepAnimation = { from: MovingDirection; to: MovingDirection }

export type StepState = "inTransition" | "transitionDone"

export type StepPart = FC<{
	disabled: boolean
	inactive: boolean
	onNext?: () => void
	onPrev?: () => void
	onEnter?: () => void
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

export const Step: FC<PropsWithChildren<StepProps>> = ({
	onNext,
	onPrev,
	inactive = false,
	disabled = false,
	children,
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
			className={`step${animatedClass ? ` ${animatedClass}` : ""} ${
				className ? className : ""
			}`}
			style={{ position: "absolute" }}>
			<div>
				{header
					? header({
							disabled,
							inactive: inactive || transitionNotDone,
							onEnter,
							onNext,
							onPrev,
					  })
					: null}
			</div>
			<div className={`step-body`}>
				{children}
				{body
					? body({
							disabled,
							inactive: inactive || transitionNotDone,
							onEnter,
							onNext,
							onPrev,
					  })
					: null}
			</div>
			<div className={`step-footer`}>
				{footer
					? footer({
							disabled,
							inactive: inactive || transitionNotDone,
							onEnter,
							onNext,
							onPrev,
					  })
					: null}
			</div>
		</div>
	)
}
