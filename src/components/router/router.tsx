import { CSSProperties, FC, useContext, useMemo } from "react"

import { StepID, StateContext } from "@Components/stateContext"
import { StepAnimation, MovingDirection } from "../step/step"
import { AgreementStep } from "@Pages/agreementStep"
import { BeginVerifyingStep } from "@Pages/beginVerifying"
import { ChainSelection } from "@Pages/chainSelectionStep"
import { EmailDiscordVerificationStep } from "@Pages/emailDiscordVerificationStep"
import { FinalStep } from "@Pages/finalStep"
import { LoadingCard } from "@Pages/loading/loading"
import { KycDAOMembershipStep } from "@Pages/membershipCard/membershipCard"
import { MintStep } from "@Pages/mintMembershipCard/mintMembershipCard"
import { NftSelection } from "@Pages/nftArtSelection/nftArtSelection"
import { TaxResidenceStep } from "@Pages/taxResidence"
import { VerificationStep } from "@Pages/verificationStep"

import { SubscribedStartStep } from "@Pages/subscribedStartStep"
import clsx from "clsx"

import classes from "./_router.module.css"

const RoutedStep: FC<{
	stepID: StepID
	animation?: StepAnimation
	disabled?: boolean
	inactive?: boolean
	style?: CSSProperties
}> = ({ stepID, ...options }) => {
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
			return <BeginVerifyingStep {...options} />
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
			return <LoadingCard {...options} />
		}
		case StepID.mintStep: {
			return <MintStep {...options} />
		}
		case StepID.subscribedStartStep: {
			return <SubscribedStartStep {...options} />
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

const prevAnimation = {
	from: "moving-center" as MovingDirection,
	to: "moving-out" as MovingDirection,
}

const nextAnimation = {
	from: "moving-center" as MovingDirection,
	to: "moving-in" as MovingDirection,
}

const stepStyle = { width: "100%", height: "100%" }

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

	const containerClasses = useMemo(
		() => clsx(currentModal && "blurred", classes.routerContainer),
		[currentModal]
	)

	return (
		<div className={containerClasses}>
			{prevPage && (
				<RoutedStep
					stepID={prevPage}
					animation={currentModal ? undefined : prevAnimation}
					inactive={true}
					style={stepStyle}
				/>
			)}
			<RoutedStep
				stepID={currentPage}
				animation={currentModal ? undefined : currentAnimation}
				inactive={!!currentModal}
				disabled={!!currentModal}
				style={stepStyle}
			/>
			{nextPage && (
				<RoutedStep
					stepID={nextPage}
					animation={currentModal ? undefined : nextAnimation}
					inactive={true}
					style={stepStyle}
				/>
			)}
		</div>
	)
}
