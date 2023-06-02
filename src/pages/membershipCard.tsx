import { FC, useContext, useCallback, useEffect } from "react"
import { getNetworkType } from "@Utils/getNetworkType"

import { useKycDao } from "@Hooks/useKycDao"
import { PageProps } from "@Pages/pageProps"

import { StatusError } from "@kycdao/kycdao-sdk"

import styled from "styled-components"
import {
  B,
  DataActionTypes,
  H1,
  HeaderButtons,
  Link,
  Logo,
  OnNext,
  OnPrev,
  P,
  Policy,
  StateContext,
  Step,
  StepID,
  StepPart,
  SubmitButton,
  Ul,
} from "@Components/index"
import useChangePage from "@Hooks/useChangePage"
import useErrorHandler from "@Hooks/errorHandler"

const Footer: StepPart = ({ disabled, inactive, onEnter }) => (
  <>
    <Policy>
      By starting verification you accept{" "}
      <Link
        target="_blank"
        rel="noreferrer"
        href="https://kycdao.xyz/privacy-policy">
        Privacy Policy
      </Link>{" "}
      and{" "}
      <Link
        target="_blank"
        rel="noreferrer"
        href="https://kycdao.xyz/terms-and-conditions">
        Terms &#38; Conditions.
      </Link>
    </Policy>
    <SubmitButton
      black
      fullWidth
      autoFocus={!inactive && !disabled}
      disabled={disabled}
      inactive={inactive}
      onClick={onEnter}
      label="Join"
    />
  </>
)

const Li = styled.li`
  list-style: none;
  display: flex;
  margin-bottom: 2rem;
  align-items: center;
  position: relative;

  &:after {
    display: block;
    content: "";
    height: 100%;
    width: 1px;
    background-color: var(--kyc-sdk-cybergreen);
    position: absolute;
    top: 2rem;
    left: 1rem;
  }

  &:last-child {
    &:after {
      display: none;
    }
  }

  & > span {
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  }

  & > div {
    margin-left: 1rem;
    display: flex;
    flex-flow: column;

    ${P},
    b {
      font-family: var(--kyc-sdk-primary-font);
      font-weight: 400;
      color: black;
      margin-bottom: 0;
    }

    b {
      font-size: 12px;
      color: black;
    }
  }
`

const Span = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 2rem;
  width: 2rem;
  outline: 0.5rem solid var(--kyc-sdk-cybergreen-35);
  border-radius: 999rem;
  background: var(--kyc-sdk-cybergreen);
  color: black;
  font-weight: 800;
`

const ProcessContainer = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`

const ChartUl = styled(Ul)`
  margin: 0 auto;
`

const Body = () => {
  return (
    <>
      <ProcessContainer>
        <ChartUl>
          <Li>
            <Span>1</Span>
            <div>
              <P>Connect</P>
              <B>Using your wallet</B>
            </div>
          </Li>
          <Li>
            <Span>2</Span>
            <div>
              <P>Verify</P>
              <B>Log-in or Open a compliant account</B>
            </div>
          </Li>
          <Li>
            <Span>3</Span>
            <div>
              <P>Mint</P>
              <B>kycNFT - $5</B>
            </div>
          </Li>
        </ChartUl>
      </ProcessContainer>
    </>
  )
}

const Header = () => (
  <H1>
    <Logo />
    KycDAO Membership
  </H1>
)

export const KycDAOMembershipStep: FC<PageProps> = ({
  className,
  animation,
  disabled = false,
  inactive = false,
}) => {
  const {
    dispatch,
    data: { returningUserFlow },
  } = useContext(StateContext)
  const redirect = useChangePage()
  const errorHandler = useErrorHandler()

  const kycDaoContext = useKycDao()

  const onPrev = useCallback(() => {
    if (returningUserFlow) {
      redirect(StepID.subscribedStartStep, StepID.kycDAOMembershipStep, "prev")
    } else {
      redirect(StepID.AgreementStep, StepID.kycDAOMembershipStep, "prev")
    }
  }, [redirect, returningUserFlow])

  useEffect(() => {
    if (!disabled && !inactive) {
      const prev = OnPrev.subscribe(onPrev)
      return prev.unsubscribe.bind(prev)
    }
  }, [disabled, inactive, onPrev])

  const onSubmit = useCallback(async () => {
    if (kycDaoContext) {
      const network = getNetworkType(
        kycDaoContext.kycDao.sdkStatus.availableBlockchainNetworks[0]
      )
      if (network) {
        try {
          await kycDaoContext.kycDao.connectWallet(network)
          await kycDaoContext.kycDao.registerOrLogin()
          redirect(StepID.verifyAccountStep, StepID.kycDAOMembershipStep)
          dispatch({ type: DataActionTypes.termsAcceptedChange, payload: true })
        } catch (e) {
          // TODO: nicer error handling for unsupported network https://kycdao.atlassian.net/browse/KYC-505
          let errorMsg =
            "Connecting to your wallet failed, because of an error. Please try again."
          if (e instanceof StatusError && e.errorCode === "NetworkNotEnabled") {
            errorMsg = `Please switch your wallet to ${kycDaoContext.kycDao.sdkStatus.availableBlockchainNetworks[0]}`
          } else if (e instanceof Error) {
            errorMsg = `${errorMsg} (${e.message})`
          }

          errorHandler("modal", errorMsg)
        }
      }
    }
  }, [dispatch, kycDaoContext, redirect, errorHandler])

  useEffect(() => {
    if (!disabled && !inactive) {
      const next = OnNext.subscribe(onSubmit)
      return next.unsubscribe.bind(next)
    }
  }, [disabled, inactive, onSubmit])

  const onTransitionDone = useCallback(() => {
    if (!disabled && !inactive) {
      dispatch({
        payload: { button: HeaderButtons.prev, state: "enabled" },
        type: DataActionTypes.SetHeaderButtonState,
      })
      dispatch({
        payload: { button: HeaderButtons.next, state: "enabled" },
        type: DataActionTypes.SetHeaderButtonState,
      })
    }
  }, [disabled, inactive, dispatch])

  return (
    <Step
      onNext={onSubmit}
      onPrev={onPrev}
      inactive={inactive}
      onTransitionDone={onTransitionDone}
      disabled={disabled}
      animation={animation}
      className={className}
      onEnter={onSubmit}
      footer={Footer}
      body={Body}
      header={Header}
    />
  )
}
