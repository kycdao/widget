import { FC, useCallback, useContext, useEffect } from "react"
import {
	DataActionTypes,
	HeaderButtons,
	OnNext,
	StateContext,
	StepID,
} from "../components/stateContext"
import { Step, StepPart } from "../components/step/step"
import { SubmitButton } from "../components/submitButton/submitButton"
import { useKycDao } from "../hooks/useKycDao"
import { PageProps } from "./pageProps"

const Header: StepPart = () => (
	<h1 className="h1">
		<span className="logo">
			<svg
				width="16"
				height="21"
				viewBox="0 0 16 21"
				fill="none"
				xmlns="http://www.w3.org/2000/svg">
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M16.0007 1.39121L14.6095 0L8.00129 6.60825L6.26227 4.86924L4.87106 6.26045L8.00129 9.39067L16.0007 1.39121ZM0.00195312 1.39146L3.47998 4.86948L4.87119 3.47827L1.39316 0.00024517L0.00195312 1.39146Z"
					fill="black"
				/>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M15.9982 12.9811L14.607 11.5898L7.99872 18.1981L6.25971 16.4591L4.8685 17.8503L7.99872 20.9805L15.9982 12.9811ZM0 12.9817L3.47803 16.4598L4.86924 15.0686L1.39121 11.5905L0 12.9817Z"
					fill="black"
				/>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M15.999 7.07871L12.521 10.5567L11.1298 9.16553L14.6078 5.6875L15.999 7.07871ZM0.000940445 7.07903L1.39215 5.68782L8.0004 12.2961L9.73941 10.5571L11.1306 11.9483L8.0004 15.0785L0.000940445 7.07903Z"
					fill="black"
				/>
			</svg>
		</span>
		KycDAO
	</h1>
)

const Footer: StepPart = ({ inactive, disabled, onEnter }) => (
	<SubmitButton
		autoFocus={!inactive && !disabled}
		disabled={disabled}
		className="full-width black"
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

	const onSubmit = useCallback(() => {
		dispatch({
			type: DataActionTypes.changePage,
			payload: {
				current: StepID.kycDAOMembershipStep,
				prev: StepID.AgreementStep,
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

	const body = useCallback(() => {
		return (
			<>
				<p>
					<b>The last proof you need in web3.</b>
					<br />
					<br />
					kycDAO is a web3 native reusable compliance framework.
					<br />
					<br />
					CEXs/Ramps already know your wallet address; kycDAO makes it
					composable.
					<br />
					<br />
					Our proofs allow smart contracts and services to interacting with
					trusted wallets.
					<br />
					<br />
					We use soulbound NFTs to prove your compliant account. Strictly no
					PII!
				</p>
			</>
		)
	}, [])

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
			body={body}
		/>
	)
}
