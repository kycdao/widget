import { CloseOnlyHeader } from "@Components/header/closeOnlyHeader"
import { Step, H1, P, Button, StateContext } from "@Components/index"
import { useCallback, useContext } from "react"
import { FallbackProps } from "react-error-boundary"

const Header = () => <H1>Something went wrong!</H1>

export const ErrorPageFactory = (messageTargetOrigin: string) =>
	function ErrorPage({ error, resetErrorBoundary }: FallbackProps) {
		const {
			data: { onFail },
		} = useContext(StateContext)

		const body = useCallback(() => {
			return (
				<div role="alert">
					<P>{error.message || "An unknown, fatal error happened!"}</P>
				</div>
			)
		}, [error.message])

		const onClose = useCallback(() => {
			onFail?.()
		}, [onFail])

		const footer = useCallback(
			() => (
				<Button mode="underline" onClick={resetErrorBoundary}>
					<i className="material-icons">refresh</i>
					<span>Retry</span>
				</Button>
			),
			[resetErrorBoundary]
		)

		return (
			<>
				<CloseOnlyHeader onClose={onClose} />
				<Step footer={footer} disabled={false} header={Header} body={body} />
			</>
		)
	}
