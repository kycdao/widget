import { CloseOnlyHeader } from "@Components/header/closeOnlyHeader"
import { Step, H1, P, Button } from "@Components/index"
import { KycDaoClientMessageBody } from "KycDaoClientCommon"
import { useCallback } from "react"
import { FallbackProps } from "react-error-boundary"

const Header = () => <H1>Something went wrong!</H1>

export const ErrorPageFactory = (messageTargetOrigin: string) =>
  function ErrorPage({ error, resetErrorBoundary }: FallbackProps) {
    const body = useCallback(() => {
      return (
        <div role="alert">
          <P>{error.message || "An unknown, fatal error happened!"}</P>
        </div>
      )
    }, [error.message])

    const onClose = useCallback(() => {
      window.parent.postMessage(
        { type: "kycDaoCloseModal" } as KycDaoClientMessageBody,
        messageTargetOrigin
      )
    }, [])

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
