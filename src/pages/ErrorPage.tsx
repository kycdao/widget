import { FC, useCallback } from "react"
import { Step } from "@Components/step/step"
import { FallbackProps } from "react-error-boundary"
import { H1 } from "@Style/index"

const Header = () => <H1>Something went wrong!</H1>

export const ErrorPage: FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
	const body = useCallback(() => {
		return (
			<div role="alert">
				<pre>{error.message}</pre>
				<button onClick={resetErrorBoundary}>Try again</button>
			</div>
		)
	}, [error.message, resetErrorBoundary])

	return <Step disabled={false} header={Header} body={body} />
}
