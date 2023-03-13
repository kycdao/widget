import {
	DataActionTypes,
	H1,
	H3,
	HeaderButtons,
	Logo,
	OnNext,
	P,
	StateContext,
	Step,
	StepPart,
	SubmitButton,
} from "@Components/index"
import { useKycDao } from "@Hooks/useKycDao"
import { FC, useContext, useCallback, useEffect } from "react"
import { PageProps } from "./pageProps"

const Body = () => {
	return (
		<>
			<H3>Welcome back trusted anon.</H3>
			<P>
				You are already a member, but a smart contract requires a kycNFT on this
				chain.
			</P>
			<P>Please go ahead and mint a free kycNFT.</P>
		</>
	)
}

const Header: StepPart = () => (
	<H1>
		<Logo />
		Welcome back to kycDAO
	</H1>
)

const Footer: StepPart = ({ inactive, disabled, onEnter }) => (
	<SubmitButton
		black
		fullWidth
		autoFocus={!inactive && !disabled}
		disabled={disabled}
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
		// redirect(StepID.nftArtSelection, StepID.subscribedStartStep)
		dispatch({ type: DataActionTypes.GoToNextStep })
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
		return <H1>Something went seriously wrong!</H1>
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
