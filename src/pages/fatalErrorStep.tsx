import {
	Step,
	H1,
	P,
	Button,
	StateContext,
	DataActionTypes,
	HeaderButtons,
} from "@Components/index"
import { RestartContext } from "@Components/restartContext"
import { FC, useCallback, useContext, useEffect } from "react"
import { PageProps } from "./pageProps"

export const FatalErrorStep: FC<PageProps> = ({
	disabled = false,
	...rest
}) => {
	const {
		data: { error },
		dispatch,
	} = useContext(StateContext)

	const ResetApp = useContext(RestartContext)

	const { body, header } = error || {
		errorModalHeader: "Something went wrong!",
		errorModalBody: "An unknown, fatal error happened!",
	}

	const Header = () => <H1>{header}</H1>

	const startAgain = useCallback(() => {
		ResetApp()
	}, [ResetApp])

	useEffect(() => {
		dispatch({
			type: DataActionTypes.SetHeaderButtonState,
			payload: { button: HeaderButtons.close, state: "enabled" },
		})
		dispatch({
			type: DataActionTypes.SetHeaderButtonState,
			payload: { button: HeaderButtons.next, state: "hidden" },
		})
		dispatch({
			type: DataActionTypes.SetHeaderButtonState,
			payload: { button: HeaderButtons.prev, state: "hidden" },
		})
	}, [dispatch])

	const modalBody = useCallback(
		() => (
			<div role="alert">
				<P>{body}</P>
			</div>
		),
		[body]
	)

	const footer = useCallback(
		() => (
			<Button mode="underline" onClick={startAgain}>
				<i className="material-icons">refresh</i>
				<span> Retry</span>
			</Button>
		),
		[startAgain]
	)

	return (
		<Step
			{...rest}
			disabled={disabled}
			footer={footer}
			header={Header}
			body={modalBody}
		/>
	)
}
