import {
	DataActionTypes,
	H1,
	HeaderButtons,
	Logo,
	OnNext,
	OnPrev,
	P,
	StateContext,
	Step,
	StepID,
	StepPart,
	SubmitButton,
} from "@Components/index"
import { FC, useContext, useCallback, useEffect, useState } from "react"
import { PageProps } from "./pageProps"
import useChangePage from "@Hooks/useChangePage"
import styled, { css } from "styled-components/macro"
import { Selector } from "./selector"

import VerilabsIcon from "@Images/verilabs-icon.svg"
import EmptyIcon from "@Images/empty-icon.svg"

const Footer: StepPart = ({ disabled, inactive, onEnter }) => (
	<SubmitButton
		black
		fullWidth
		autoFocus={!disabled && !inactive}
		disabled={disabled}
		inactive={inactive}
		onClick={onEnter}
	/>
)

const Header = () => (
	<H1>
		<Logo />
		Verify account
	</H1>
)

type AccountProivderProps = {
	icon: string
	label: string
	id: string
	onClick?: (id: string) => void
	selected?: boolean
	comingSoon?: boolean
	disabled?: boolean
}

const AccountProivderContainer = styled.div<{
	selected?: boolean
	disabled?: boolean
}>`
	display: flex;
	flex-direction: row;
	margin-bottom: 2em;
	margin-block: auto;
	border: 2px solid transparent;
	border-radius: 6px;

	${({ disabled }) =>
		!disabled &&
		css`
			&:hover {
				cursor: pointer;
				box-shadow: 0 0 0 5px var(--kyc-sdk-cybergreen-35);
				border: 2px solid black;
			}
		`}

	${({ selected }) =>
		selected &&
		css`
			 {
				cursor: pointer;
				box-shadow: 0 0 0 5px var(--kyc-sdk-cybergreen-35);
				border: 2px solid black;
			}
		`}
`

const AccountIcon = styled.img`
	width: 64px;
	height: 64px;
`

const AccountProviderLabel = styled(P)<{ comingSoon?: boolean }>`
	margin-block: auto;
	min-width: 8em;
	margin-inline-start: 1em;
	${({ comingSoon }) =>
		comingSoon &&
		css`
			text-shadow: 0 0 12px black;
			color: transparent !important;
		`};
`

const ComingSoonLabel = styled(P)`
	border: solid 2px black;
	border-radius: 3px;
	margin-block: auto;
`

function AccountProvider({
	icon,
	id,
	label,
	onClick,
	comingSoon,
	disabled,
	selected,
}: AccountProivderProps) {
	const onItemClick = useCallback(() => onClick && onClick(id), [id, onClick])

	return (
		<AccountProivderContainer
			selected={selected}
			disabled={disabled || comingSoon}
			onClick={onItemClick}>
			<AccountIcon src={icon} />
			<AccountProviderLabel comingSoon={comingSoon}>
				{label}
			</AccountProviderLabel>
			{comingSoon && <ComingSoonLabel>soon</ComingSoonLabel>}
		</AccountProivderContainer>
	)
}

const AccountProviders: AccountProivderProps[] = [
	{
		icon: VerilabsIcon,
		id: "verilabs",
		label: "VeriLabs",
	},
	{
		icon: EmptyIcon,
		id: "soon1",
		label: "Are you really",
		comingSoon: true,
	},
	{
		icon: EmptyIcon,
		id: "soon2",
		label: "this curius,",
		comingSoon: true,
	},
	{
		icon: EmptyIcon,
		id: "soon3",
		label: "aren't you? 🥚",
		comingSoon: true,
	},
]

export const VerifyAccountStep: FC<PageProps> = ({
	className,
	disabled = false,
	animation,
	inactive = false,
}) => {
	const { dispatch } = useContext(StateContext)
	const redirect = useChangePage()

	const onSubmit = useCallback(() => {
		redirect(StepID.emailDiscordVerificationStep, StepID.verificationStep)
	}, [redirect])

	const onPrev = useCallback(() => {
		redirect(StepID.kycDAOMembershipStep, StepID.verificationStep, "prev")
	}, [redirect])

	const [provider, setProvider] = useState("verilabs")

	const body = useCallback(() => {
		return (
			<>
				<P>
					Log-in to your existing account or onboard with one of our partners.
				</P>
				<Selector
					current={provider}
					onChange={setProvider}
					items={AccountProviders}
					keyExtractor={(i) => i.id}
					disabledCheck={(i) => i.disabled || i.comingSoon}
					renderItem={(item) =>
						AccountProvider({
							...item,
							selected: provider === item.id,
							disabled: item.disabled,
						})
					}
				/>
			</>
		)
	}, [provider])

	useEffect(() => {
		if (!disabled && !inactive) {
			const next = OnNext.subscribe(onSubmit)
			return next.unsubscribe.bind(next)
		}
	}, [disabled, inactive, onSubmit])

	useEffect(() => {
		if (!disabled && !inactive) {
			const prev = OnPrev.subscribe(onPrev)
			return prev.unsubscribe.bind(prev)
		}
	}, [disabled, inactive, onPrev])

	const onStateChange = useCallback(() => {
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
	}, [disabled, dispatch, inactive])

	return (
		<Step
			onPrev={onPrev}
			onNext={onSubmit}
			onTransitionDone={onStateChange}
			inactive={inactive}
			disabled={disabled}
			animation={animation}
			className={className}
			onEnter={onSubmit}
			footer={Footer}
			body={body}
			header={Header}
		/>
	)
}
