import { useContext, useCallback, useState, useEffect, FC } from "react"

import { PageProps } from "./pageProps"
import { useKycDao } from "@Hooks/useKycDao"
import styled from "styled-components/macro"
import {
	Button,
	Centered,
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
import {
	KycDaoClientMessageBody,
	KycDaoClientMessageTypes,
} from "../StandaloneClientCommon"
import useErrorHandler from "@Hooks/useErrorHandler"
import { TwitterShareButton } from "react-twitter-embed"

export const NftButtonWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`

const NftImageContainer = styled.div`
	${Centered}
`

const TwitterButtonContainer = styled.div`
	justify-content: center;
	display: flex;
	padding-top: 1em;
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
			chainExplorerUrl,
			nftImageUrl,
			alreadyHaveAnNftOnThisChain,
			nearMinted,
			onSuccess,
			messageTargetOrigin,
		},
	} = useContext(StateContext)

	const { handleError } = useErrorHandler()

	const header = useCallback(
		() =>
			alreadyHaveAnNftOnThisChain ? <></> : <H1 marginBottom="0">Congrats!</H1>,
		[alreadyHaveAnNftOnThisChain]
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
			;(async function () {
				if (alreadyHaveAnNftOnThisChain) {
					try {
						const tokens = (await kycDao.kycDao.getValidNfts("KYC")).tokens

						if (tokens && tokens.length > 0 && tokens[0].image) {
							setDisplayedNftImageUrl(tokens[0].image)
						}
					} catch (error) {
						handleError("modal", error)
					}
				} else {
					setDisplayedNftImageUrl(kycDao.mintingResult?.imageUrl || nftImageUrl)
				}
			})()
		}
	}, [kycDao, nftImageUrl, handleError, alreadyHaveAnNftOnThisChain])

	const body = useCallback<StepPart>(
		(props) => (
			<>
				<CenteredH1 marginBottom="0">
					{alreadyHaveAnNftOnThisChain && !nearMinted
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
				<TwitterButtonContainer>
					<TwitterShareButton
						url={"https://kycdao.xyz/"}
						// See options here: https://developer.twitter.com/en/docs/twitter-for-websites/tweet-button/overview
						options={{
							text: "I’m the n-th #trustedanon of #web3 bc I joined @kycdao!",
							hashtags: "kyc",
							size: "large",
						}}
					/>
				</TwitterButtonContainer>
			</>
		),
		[kycDao, displayedNftImageUrl, alreadyHaveAnNftOnThisChain, nearMinted]
	)

	const onFinish = useCallback(async () => {
		if (alreadyHaveAnNftOnThisChain) {
			onSuccess?.(
				`Already has an nft on ${kycDao?.kycDao.connectedWallet?.blockchainNetwork}.`
			)
			window.parent.postMessage(
				{
					type: KycDaoClientMessageTypes.kycDaoSuccess,
					data: `Already has an nft on ${kycDao?.kycDao.connectedWallet?.blockchainNetwork}.`,
				} as KycDaoClientMessageBody,
				messageTargetOrigin
			)
		} else {
			window.parent.postMessage(
				{
					type: KycDaoClientMessageTypes.kycDaoSuccess,
					data: chainExplorerUrl,
				} as KycDaoClientMessageBody,
				messageTargetOrigin
			)
			return
		}

		onSuccess?.(chainExplorerUrl || "")
	}, [
		alreadyHaveAnNftOnThisChain,
		chainExplorerUrl,
		onSuccess,
		messageTargetOrigin,
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
