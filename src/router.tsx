import { CSSProperties, FC, useContext } from "react"
import { StepID, StateContext } from "./components/stateContext"
import { StepAnimation, MovingDirection } from "./components/step/step"
import { AgreementStep } from "./pages/agreementStep"
import { BeginVerifyingStep } from "./pages/beginVerifying"
import { ChainSelection } from "./pages/chainSelectionStep"
import { EmailDiscordVerificationStep } from "./pages/emailDiscordVerificationStep"
import { FinalStep } from "./pages/finalStep"
import { Loading } from "./pages/loading"
import { KycDAOMembershipStep } from "./pages/membershipStep"
import { NftSelection } from "./pages/nftArtSelection"
import { TaxResidenceStep } from "./pages/taxResidence"
import { VerificationStep } from "./pages/verificationStep"

const GetStep = ({
  stepID,
  ...options
}: {
  stepID: StepID
  animation?: StepAnimation
  disabled?: boolean
  inactive?: boolean
  style?: CSSProperties
}) => {
  switch (stepID) {
    case StepID.AgreementStep: {
      return <AgreementStep {...options} />
    }
    case StepID.kycDAOMembershipStep: {
      return <KycDAOMembershipStep {...options} />
    }
    case StepID.verificationStep: {
      return <VerificationStep {...options} />
    }
    case StepID.emailDiscordVerificationStep: {
      return <EmailDiscordVerificationStep {...options} />
    }
    case StepID.taxResidenceStep: {
      return <TaxResidenceStep {...options} />
    }
    case StepID.beginVerificationStep: {
      return <BeginVerifyingStep />
    }
    case StepID.nftArtSelection: {
      return <NftSelection {...options} />
    }
    case StepID.chainSelection: {
      return <ChainSelection {...options} />
    }
    case StepID.finalStep: {
      return <FinalStep {...options} />
    }
    case StepID.loading: {
      return <Loading {...options} />
    }
    default: {
      return <>Something went wrong</>
    }
  }
}

function GetMovingAnimation(
  prevStep?: StepID,
  nextStep?: StepID
): MovingDirection {
  if (prevStep) {
    return "moving-in"
  } else if (nextStep) {
    return "moving-out"
  }
  return "moving-center"
}

export const Router: FC = () => {
  const {
    data: { prevPage, nextPage, currentPage },
  } = useContext(StateContext)

  return (
    <div style={{ display: "block", width: "100%", height: "100%" }}>
      {prevPage
        ? GetStep({
            stepID: prevPage,
            animation: { from: "moving-center", to: "moving-out" },
            inactive: true,
            style: { width: "100%", height: "100%" },
          })
        : null}
      {GetStep({
        stepID: currentPage,
        animation:
          prevPage || nextPage
            ? {
                to: "moving-center",
                from: GetMovingAnimation(prevPage, nextPage),
              }
            : undefined,
        inactive: false,
        style: { width: "100%", height: "100%" },
      })}
      {nextPage
        ? GetStep({
            stepID: nextPage,
            animation: { from: "moving-center", to: "moving-in" },
            inactive: true,
            style: { width: "100%", height: "100%" },
          })
        : null}
    </div>
  )
}
