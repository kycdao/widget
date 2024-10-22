import { StateContext, StepID } from "@Components/stateContext"
import { StepAnimation, MovingDirection } from "@Components/step/step"

import { CSSProperties, FC, useContext, useMemo } from "react"

import styled from "styled-components"
import { AgreementStep } from "./agreementStep"
import { BeginVerifyingStep } from "./beginVerifying"
import { EmailDiscordVerificationStep } from "./emailDiscordVerificationStep"
import { FatalErrorStep } from "./fatalErrorStep"
import { FinalStep } from "./finalStep"
import { GrantNameAndAddress } from "./grantNameAndAddress"
import { GrantSocialSecurityNumber } from "./grantSocialSecurityNumber"
import { LoadingCard } from "./loading"
import { KycDAOMembershipStep } from "./membershipCard"
import { MintStep } from "./mintMembershipCard"
import { NftSelection } from "./nftArtSelection"
import { SubscribedStartStep } from "./subscribedStartStep"
import { TaxResidenceStep } from "./taxResidence"
import { VerificationStep } from "./verificationStep"
import { VerifyAccountStep } from "./verifyAccount"

const RouterContainer = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;
  position: absolute;
  height: 100%;
  top: 0;
`

const RoutedStep: FC<{
  stepID: StepID
  animation?: StepAnimation
  disabled?: boolean
  inactive?: boolean
  style?: CSSProperties
}> = ({ stepID, ...options }) => {
  switch (stepID) {
    case StepID.verifyAccountStep: {
      return <VerifyAccountStep {...options} />
    }
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
    case StepID.grantNameAndAddressStep: {
      return <GrantNameAndAddress {...options} />
    }
    case StepID.grantSocialSecurityNumberStep: {
      return <GrantSocialSecurityNumber {...options} />
    }
    case StepID.beginVerificationStep: {
      return <BeginVerifyingStep {...options} />
    }
    case StepID.nftArtSelection: {
      return <NftSelection {...options} />
    }
    case StepID.finalStep: {
      return <FinalStep {...options} />
    }
    case StepID.loading: {
      return <LoadingCard {...options} />
    }
    case StepID.mintStep: {
      return <MintStep {...options} />
    }
    case StepID.subscribedStartStep: {
      return <SubscribedStartStep {...options} />
    }
    case StepID.fatalError:
    default:
      return <FatalErrorStep {...options} />
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

const prevAnimation = {
  from: "moving-center" as MovingDirection,
  to: "moving-out" as MovingDirection,
}

const nextAnimation = {
  from: "moving-center" as MovingDirection,
  to: "moving-in" as MovingDirection,
}

export const Router: FC = () => {
  const {
    data: { prevPage, nextPage, currentPage, currentModal },
  } = useContext(StateContext)

  const currentAnimation = useMemo(() => {
    return prevPage || nextPage
      ? {
          to: "moving-center" as MovingDirection,
          from: GetMovingAnimation(prevPage, nextPage),
        }
      : undefined
  }, [nextPage, prevPage])

  return (
    <RouterContainer>
      {prevPage && (
        <RoutedStep
          stepID={prevPage}
          animation={prevAnimation}
          inactive={true}
        />
      )}
      <RoutedStep
        stepID={currentPage}
        animation={currentAnimation}
        inactive={!!currentModal}
        disabled={!!currentModal}
      />
      {nextPage && (
        <RoutedStep
          stepID={nextPage}
          animation={nextAnimation}
          inactive={true}
        />
      )}
    </RouterContainer>
  )
}
