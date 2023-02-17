import { useContext, useCallback, useState, useEffect, FC } from "react"

import { PageProps } from "./pageProps"
import { useKycDao } from "@Hooks/useKycDao"
import styled from "styled-components"
import {
	Button,
	CenteredH1,
	DataActionTypes,
	H1,
	HeaderButtons,
	Placeholder,
	StateContext,
	Step,
	StepPart,
	SubmitButton,
} from "@Components/index"
import { KycDaoClientMessageBody } from "KycDaoClientCommon"

export const NftButtonWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`

const NftImageContainer = styled.div`
	text-align: center;
`

export const FinalStep: FC<PageProps> = ({
	className,
	animation,
	disabled = false,
	// inactive = false,
}) => {
	const kycDao = useKycDao()
	const {
		dispatch,
		data: {
			messageTargetOrigin,
			chainExplorerUrl,
			nftImageUrl,
			returningUserFlow,
			alreadyHaveAnNftOnThisChain,
		},
	} = useContext(StateContext)

	const header = useCallback(
		() => (returningUserFlow ? <></> : <H1>Congrats!</H1>),
		[returningUserFlow]
	)

	const onTransitionDone = useCallback(() => {
		if (!disabled) {
			dispatch({
				payload: { button: HeaderButtons.prev, state: "hidden" },
				type: DataActionTypes.SetHeaderButtonState,
			})
			dispatch({
				payload: { button: HeaderButtons.next, state: "hidden" },
				type: DataActionTypes.SetHeaderButtonState,
			})
			dispatch({
				payload: { button: HeaderButtons.close, state: "enabled" },
				type: DataActionTypes.SetHeaderButtonState,
			})
		}
	}, [disabled, dispatch])

	const [displayedNftImageUrl, setDisplayedNftImageUrl] = useState<
		string | undefined
	>("")

	const onCheck = useCallback(() => {
		window.open(chainExplorerUrl, "_blank")
	}, [chainExplorerUrl])

	useEffect(() => {
		if (kycDao) {
			setDisplayedNftImageUrl(kycDao.mintingResult?.imageUrl || nftImageUrl)
		}
	}, [kycDao, nftImageUrl])

	const body = useCallback<StepPart>(
		(props) => (
			<>
				<CenteredH1>
					{returningUserFlow
						? "You already have a "
						: "You have successfully minted your "}
					kycNFT on {kycDao?.kycDao.connectedWallet?.blockchainNetwork}
				</CenteredH1>
				<NftImageContainer>
					{displayedNftImageUrl ? (
						<img
							alt=""
							src={displayedNftImageUrl}
							width="300px"
							height="300px"
						/>
					) : (
						<Placeholder width="300px" height="300px" />
					)}
				</NftImageContainer>
			</>
		),
		[kycDao, displayedNftImageUrl, returningUserFlow]
	)

	const onFinish = useCallback(async () => {
		if (alreadyHaveAnNftOnThisChain) {
			window.parent.postMessage(
				{
					type: "kycDaoSuccess",
					data: `Already has an nft on ${kycDao?.kycDao.connectedWallet?.blockchainNetwork}.`,
				} as KycDaoClientMessageBody,
				messageTargetOrigin
			)
		} else {
			window.parent.postMessage(
				{
					type: "kycDaoSuccess",
					data: chainExplorerUrl,
				} as KycDaoClientMessageBody,
				messageTargetOrigin
			)
		}
	}, [
		messageTargetOrigin,
		chainExplorerUrl,
		alreadyHaveAnNftOnThisChain,
		kycDao?.kycDao.connectedWallet?.blockchainNetwork,
	])

	const footer = useCallback<StepPart>(
		({ disabled, inactive }) => (
			<>
				{chainExplorerUrl && (
					<NftButtonWrapper>
						<Button
							disabled={disabled}
							inactive={inactive}
							centered
							fullWidth
							mode="underline"
							onClick={onCheck}>
							Check on chain
						</Button>
					</NftButtonWrapper>
				)}
				<SubmitButton
					black
					fullWidth
					autoFocus={!inactive && !disabled}
					disabled={disabled}
					onClick={onFinish}
					inactive={inactive}
					label={"Finish"}
					label2={"Finish"}
				/>
			</>
		),
		[onCheck, chainExplorerUrl, onFinish]
	)

	if (!kycDao) {
		return <H1>An error happened!</H1>
	}

	return (
		<Step
			onTransitionDone={onTransitionDone}
			disabled={disabled}
			animation={animation}
			className={className}
			header={header}
			body={body}
			footer={footer}
		/>
	)
}
