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
		data: { errorModalBody, errorModalHeader },
		dispatch,
	} = useContext(StateContext)

	const ResetApp = useContext(RestartContext)

	const Header = () => <H1>{errorModalHeader || "Something went wrong!"}</H1>

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

	const body = useCallback(
		() => (
			<div role="alert">
				<P>{errorModalBody || "An unknown, fatal error happened!"}</P>
			</div>
		),
		[errorModalBody]
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
			body={body}
		/>
	)
}
