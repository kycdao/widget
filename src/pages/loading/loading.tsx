import { FC, useCallback, useContext } from "react"
import {
	DataActionTypes,
	HeaderButtons,
	StateContext,
} from "@Components/stateContext"
import { Step } from "@Components/step/step"
import { PageProps } from "../pageProps"

import { Loading } from "@Components/loading/loading"
import styled from "styled-components"

const H1 = styled.h1`
	justify-content: center;
`

const Body = () => {
	return (
		<>
			<H1 className={"h1"}>Loading</H1>
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
