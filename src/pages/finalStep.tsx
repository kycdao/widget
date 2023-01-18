import { useContext, useCallback, useState, useEffect, FC } from "react"
import { Step, StepPart } from "@Components/step/step"
import { Button } from "@Components/button/button"
import { Placeholder } from "@Components/placeholder/placeholder"
import {
	DataActionTypes,
	HeaderButtons,
	StateContext,
} from "@Components/stateContext"
import { PageProps } from "./pageProps"
import { useKycDao } from "@Hooks/useKycDao"
import { SubmitButton } from "@Components/submitButton/submitButton"
import styled from "styled-components"
import { H1 } from "@Style/index"

const Header = () => <H1>Congrats!</H1>

export const NftButtonWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
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
		data: { messageTargetOrigin, chainExplorerUrl },
	} = useContext(StateContext)

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

	const [nftImageUrl, setNftImageUrl] = useState("")

	const onCheck = useCallback(() => {
		window.open(chainExplorerUrl, "_blank")
	}, [chainExplorerUrl])

	useEffect(() => {
		if (kycDao) {
			setNftImageUrl(kycDao.kycDao.getNftImageUrl())
		}
	}, [messageTargetOrigin, kycDao])

	const body = useCallback<StepPart>(
		(props) => (
			<>
				<H1 style={{ textAlign: "center" }}>
					You have successfully minted your kycNFT on{" "}
					{kycDao?.kycDao.connectedWallet?.blockchainNetwork}
				</H1>
				<div style={{ textAlign: "center" }}>
					{nftImageUrl ? (
						<img alt="" src={nftImageUrl} width="300px" height="300px" />
					) : (
						<Placeholder width="300px" height="300px" />
					)}
				</div>
			</>
		),
		[kycDao, nftImageUrl]
	)

	const onFinish = useCallback(() => {
		window.parent.postMessage(
			{ type: "kycDaoSuccess", data: chainExplorerUrl },
			messageTargetOrigin
		)
	}, [messageTargetOrigin, chainExplorerUrl])

	const footer = useCallback<StepPart>(
		({ disabled, inactive }) =>
			chainExplorerUrl ? (
				<>
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
					<SubmitButton
						black
						fullWidth
						autoFocus={!inactive && !disabled}
						disabled={disabled}
						onClick={onFinish}
						inactive={inactive}
						label={"Finish"}
					/>
				</>
			) : null,
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
			header={Header}
			body={body}
			footer={footer}
		/>
	)
}
