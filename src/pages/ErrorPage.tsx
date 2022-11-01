import { FC } from "react"
import { Step } from "../components/step/step"
import { FallbackProps } from "react-error-boundary"

export const ErrorPage: FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
    return <Step disabled={false} header={() => <h1>Something went wrong!</h1>}>
        <div role="alert">
            <p>Something went wrong:</p>
            <pre>{error.message}</pre>
            <button onClick={resetErrorBoundary}>Try again</button>
        </div>
    </Step>
}
