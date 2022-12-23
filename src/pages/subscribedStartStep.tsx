import { Logo } from "@Components/logo/logo"
import { FC, useCallback, useContext, useEffect } from "react"
import {
	DataActionTypes,
	HeaderButtons,
	OnNext,
	StateContext,
	StepID,
} from "@Components/stateContext"
import { Step, StepPart } from "@Components/step/step"
import { SubmitButton } from "@Components/submitButton/submitButton"
import { useKycDao } from "@Hooks/useKycDao"
import { PageProps } from "./pageProps"

const Body = () => {
	return (
		<p>
			<b>Welcome back trusted anon.</b>
			<br />
			<br />
			You are already a member, but a smart contract requires a kycNFT on this
			chain.
			<br />
			<br />
			Please go ahead and mint a free kycNFT.
		</p>
	)
}

const Header: StepPart = () => (
	<h1 className="h1">
		<Logo />
		Welcome back to kycDAO
	</h1>
)

const Footer: StepPart = ({ inactive, disabled, onEnter }) => (
	<SubmitButton
		autoFocus={!inactive && !disabled}
		disabled={disabled}
		className="full-width black"
		onClick={onEnter}
		inactive={inactive}
		label={"Let's go"}
	/>
)

export const SubscribedStartStep: FC<PageProps> = ({
	className,
	animation,
	disabled = false,
	inactive = false,
}) => {
	const { dispatch } = useContext(StateContext)

	const kycDaoContext = useKycDao()

	const onSubmit = useCallback(() => {
		dispatch({
			type: DataActionTypes.changePage,
			payload: {
				current: StepID.nftArtSelection,
				prev: StepID.subscribedStartStep,
			},
		})
	}, [dispatch])

	const onTransitionDone = useCallback(() => {
		if (!disabled && !inactive) {
			dispatch({
				payload: { button: HeaderButtons.prev, state: "hidden" },
				type: DataActionTypes.SetHeaderButtonState,
			})
			dispatch({
				payload: { button: HeaderButtons.next, state: "enabled" },
				type: DataActionTypes.SetHeaderButtonState,
			})
		}
	}, [disabled, inactive, dispatch])

	useEffect(() => {
		if (!disabled && !inactive) {
			const next = OnNext.subscribe(onSubmit)
			return next.unsubscribe.bind(next)
		}
	}, [disabled, inactive, dispatch, onSubmit])

	if (!kycDaoContext) {
		return <>Something went seriously wrong!</>
	}

	return (
		<Step
			onNext={onSubmit}
			onTransitionDone={onTransitionDone}
			disabled={disabled}
			className={className}
			inactive={inactive}
			animation={animation}
			header={Header}
			onEnter={onSubmit}
			footer={Footer}
			body={Body}
		/>
	)
}
