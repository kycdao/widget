import { FC, useCallback, useContext } from "react"

import { PageProps } from "./pageProps"

import styled from "styled-components/macro"
import {
	DataActionTypes,
	HeaderButtons,
	Loading,
	P,
	StateContext,
	Step,
} from "@Components/index"

const H1 = styled.h1`
	justify-content: center;
`

export const LoadingCard: FC<PageProps> = ({
	className,
	animation,
	disabled = false,
	inactive = false,
}) => {
	const {
		dispatch,
		data: { loadingMessage },
	} = useContext(StateContext)

	const Body = useCallback(() => {
		return (
			<>
				<H1>Loading</H1>
				{loadingMessage && <P>{loadingMessage}</P>}
				<Loading />
			</>
		)
	}, [loadingMessage])

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
