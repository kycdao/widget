import { Step, H1, P, Button } from "@Components/index"
import { FC, useCallback } from "react"
import { FallbackProps } from "react-error-boundary"

const Header = () => <H1>Something went wrong!</H1>

export const ErrorPage: FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
	const body = useCallback(() => {
		return (
			<div role="alert">
				<P>{error.message || "An unknown, fatal error happened!"}</P>
				<Button mode="underline" onClick={resetErrorBoundary}>
					Try again
				</Button>
			</div>
		)
	}, [error.message, resetErrorBoundary])

	return <Step disabled={false} header={Header} body={body} />
}
