import { FC, useCallback, useContext } from "react"
import {
	DataActionTypes,
	HeaderButtons,
	StateContext,
} from "@Components/stateContext"
import { Step } from "@Components/step/step"
import { PageProps } from "../pageProps"

import classes from "./loading.module.scss"
import clsx from "clsx"
import { Loading } from "@Components/loading/loading"

const Body = () => {
	return (
		<>
			<h1
				className={clsx(classes.headerText, "h1")}
				style={{ justifyContent: "center" }}>
				Loading
			</h1>
			<Loading />
		</>
	)
}

export const LoadingCard: FC<PageProps> = ({
	className,
	animation,
	disabled = false,
	inactive = false,
}) => {
	const { dispatch } = useContext(StateContext)

	const onTransitionDone = useCallback(() => {
		if (!disabled) {
			dispatch({
				payload: { button: HeaderButtons.prev, state: "hidden" },
				type: DataActionTypes.SetHeaderButtonState,
			})
			dispatch({
				payload: { button: HeaderButtons.next, state: "hidden" },
				type: DataActionTypes.SetHeaderButtonState,
			})
		}
	}, [disabled, dispatch])

	return (
		<Step
			disabled={disabled}
			onTransitionDone={onTransitionDone}
			className={className}
			animation={animation}
			body={Body}
		/>
	)
}
