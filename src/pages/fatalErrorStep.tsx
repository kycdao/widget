import { Step, H1, P, Button, StateContext } from "@Components/index"
import { RestartContext } from "@Components/restartContext"
import { FC, useCallback, useContext } from "react"
import { PageProps } from "./pageProps"

export const FatalErrorStep: FC<PageProps> = ({
	disabled = false,
	...rest
}) => {
	const {
		data: { errorModalBody, errorModalHeader },
	} = useContext(StateContext)

	const ResetApp = useContext(RestartContext)

	const Header = () => <H1>{errorModalHeader || "Something went wrong!"}</H1>

	const startAgain = useCallback(() => {
		ResetApp()
	}, [ResetApp])

	const body = useCallback(() => {
		return (
			<div role="alert">
				<P>{errorModalBody || "An unknown, fatal error happened!"}</P>
				<Button mode="underline" onClick={startAgain}>
					Try again
				</Button>
			</div>
		)
	}, [errorModalBody, startAgain])

	return <Step disabled={disabled} {...rest} header={Header} body={body} />
}
