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
	StepID,
	StepPart,
	SubmitButton,
} from "@Components/index"
import useChangePage from "@Hooks/useChangePage"
import { useVerified } from "@Hooks/useVerified"

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
			Our proofs allow smart contracts and services to interacting with trusted
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
	const checkVerification = useVerified()
	const redirect = useChangePage()

	const kycDaoContext = useKycDao()

	const onSubmit = useCallback(async () => {
		try {
			if (await checkVerification()) {
				// If verified, then definitely accepted the terms
				dispatch({ payload: true, type: DataActionTypes.termsAcceptedChange })
				redirect(StepID.nftArtSelection, StepID.AgreementStep)
			} else {
				redirect(StepID.verifyAccountStep, StepID.AgreementStep)
			}
		} catch (e) {
			console.error(e)
		}
	}, [redirect, checkVerification, dispatch])

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
