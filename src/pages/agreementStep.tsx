import { FC, useCallback, useContext, useEffect } from "react"
import { useKycDao } from "@Hooks/useKycDao"
import { PageProps } from "./pageProps"
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

const Header: StepPart = () => (
	<H1>
		<Logo />
		KycDAO
	</H1>
)

const Body = () => (
	<>
		<H3>The last proof you need in web3.</H3>
		<P>kycDAO is a web3 native reusable compliance framework.</P>
		<P>
			CEXs/Ramps already know your wallet address; kycDAO makes it composable.
		</P>
		<P>
			Our proofs allow smart contracts and services to interact with trusted
			wallets.
		</P>
		<P>
			We use soulbound NFTs to prove your compliant account. Strictly no PII!
		</P>
	</>
)

const Footer: StepPart = ({ inactive, disabled, onEnter }) => (
	<SubmitButton
		autoFocus={!inactive && !disabled}
		disabled={disabled}
		black
		fullWidth
		onClick={onEnter}
		inactive={inactive}
		label={"Start"}
	/>
)

export const AgreementStep: FC<PageProps> = ({
	className,
	animation,
	disabled = false,
	inactive = false,
}) => {
	const { dispatch } = useContext(StateContext)

	const kycDaoContext = useKycDao()

	const onSubmit = useCallback(async () => {
		// redirect(StepID.kycDAOMembershipStep, StepID.AgreementStep)
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
