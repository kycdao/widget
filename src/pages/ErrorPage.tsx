import { FC, useCallback } from "react"
import { Step } from "../components/step/step"
import { FallbackProps } from "react-error-boundary"

const Header = () => <h1>Something went wrong!</h1>

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
