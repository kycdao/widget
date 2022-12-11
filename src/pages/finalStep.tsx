import { useContext, useCallback, useState, useEffect, FC } from "react"
import { Step, StepPart } from "../components/step/step"
import { Button } from "../components/button/button"
import { Placeholder } from "../components/placeholder/placeholder"
import {
	DataActionTypes,
	HeaderButtons,
	StateContext,
} from "../components/stateContext"
import { PageProps } from "./pageProps"
import { useKycDao } from "../hooks/useKycDao"

const Header = () => <h1>Congrats!</h1>

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
		}
	}, [disabled, dispatch])

	const [nftImageUrl, setNftImageUrl] = useState("")

	const onCheck = useCallback(() => {
		window.open(chainExplorerUrl, "_blank")
	}, [chainExplorerUrl])

	useEffect(() => {
		if (kycDao) {
			window.parent.postMessage(
				{ type: "kycDaoSuccess" },
				messageTargetOrigin || window.location.origin
			)
			setNftImageUrl(kycDao.kycDao.getNftImageUrl())
		}
	}, [messageTargetOrigin, kycDao])

	const body = useCallback<StepPart>(
		(props) => (
			<>
				<h1 style={{ textAlign: "center" }}>
					You have successfully minted your kycNFT on{" "}
					{kycDao?.kycDao.connectedWallet?.blockchainNetwork}
				</h1>
				<div className="final-texts">
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

	const footer = useCallback<StepPart>(
		({ disabled, inactive }) =>
			chainExplorerUrl ? (
				<div style={{ justifyContent: "center", display: "flex" }}>
					<Button
						disabled={disabled}
						inactive={inactive}
						className="full-width underline centered"
						onClick={onCheck}>
						Check on chain
					</Button>
				</div>
			) : null,
		[onCheck, chainExplorerUrl]
	)

	if (!kycDao) {
		return <>error</>
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
