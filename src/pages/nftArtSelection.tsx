import { useContext, useState, useCallback, FC, useEffect } from "react"

import { useKycDao } from "@Hooks/useKycDao"
import { useMinting } from "@Hooks/useMinting"
import { PageProps } from "./pageProps"

import styled, { css } from "styled-components"
import {
	Button,
	DataActionTypes,
	H1,
	HeaderButtons,
	Logo,
	OnNext,
	OnPrev,
	StateContext,
	Step,
	StepID,
	StepPart,
	SubmitButton,
	tr2,
} from "@Components/index"

import { NftButtonWrapper } from "./finalStep"

const Header = () => (
	<H1>
		<Logo />
		Select your KYC NFT art
	</H1>
)

type Nft = {
	id: string
	url: string
}

const NftImageWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
	justify-content: space-around;
	// align-content: center;
	padding: 1em;
	height: 100%;
	overflow: scroll;
`

const NftImageContainer = styled.div<{ selected: boolean }>`
	height: 150px;
	width: 150px;
	border-radius: 999rem;

	${({ selected }) => css`
		border: 2px solid ${selected ? "black" : "transparent"};
		box-shadow: 0 0 0 5px
			${selected ? "var(--kyc-sdk-cybergreen-35)" : "transparent"};
	`}

	&:hover {
		cursor: pointer;
		box-shadow: 0 0 0 5px var(--kyc-sdk-cybergreen-35);
		border: 2px solid black;
	}

	${tr2}
`

export const NftSelection: FC<PageProps> = ({
	className,
	animation,
	disabled = false,
	inactive = false,
}) => {
	const { dispatch } = useContext(StateContext)
	const kycDao = useKycDao()
	const startMinting = useMinting()
	const [currentArt, setCurrentArt] = useState<string>()

	const [nftImages, setNftImages] = useState<Nft[]>([])

	const onArtClick = useCallback(
		(id: string) => () => {
			if (!disabled) {
				setCurrentArt(id)

				dispatch({
					payload: { button: HeaderButtons.next, state: "enabled" },
					type: DataActionTypes.SetHeaderButtonState,
				})
			}
		},
		[disabled, dispatch]
	)

	useEffect(() => {
		kycDao?.kycDao.getNftImageOptions().then((options) => {
			const images = [] as Nft[]

			Object.entries(options).forEach(([, url]) => {
				const splitUrl = url.split("/")

				if (splitUrl.length > 0) {
					const id = splitUrl[splitUrl.length - 1]

					images.push({ url: url + "?timestamp=" + Date.now().toString(), id })
					setNftImages(images)
				}
			})
		})
	}, [kycDao])

	const onSubmit = useCallback(() => {
		if (currentArt) {
			dispatch({ type: DataActionTypes.nftImageChange, payload: currentArt })

			if (kycDao?.kycDao.subscribed) {
				startMinting(currentArt)
			} else {
				dispatch({
					type: DataActionTypes.changePage,
					payload: {
						current: StepID.mintStep,
						prev: StepID.nftArtSelection,
					},
				})
			}
		}
	}, [dispatch, kycDao?.kycDao.subscribed, startMinting, currentArt])

	const onPrev = useCallback(() => {
		dispatch({
			type: DataActionTypes.changePage,
			payload: {
				current: kycDao?.kycDao.subscribed
					? StepID.subscribedStartStep
					: StepID.taxResidenceStep,
				next: StepID.nftArtSelection,
			},
		})
	}, [dispatch, kycDao])

	useEffect(() => {
		if (!disabled && !inactive) {
			const prev = OnPrev.subscribe(onPrev)

			return () => {
				prev.unsubscribe()
			}
		}
	}, [disabled, inactive, onPrev])

	useEffect(() => {
		if (!disabled && !inactive) {
			const next = OnNext.subscribe(onSubmit)

			return () => {
				next.unsubscribe()
			}
		}
	}, [disabled, inactive, onSubmit])

	const onTransitionDone = useCallback(() => {
		if (!disabled && !inactive) {
			dispatch({
				payload: { button: HeaderButtons.prev, state: "enabled" },
				type: DataActionTypes.SetHeaderButtonState,
			})
			dispatch({
				payload: { button: HeaderButtons.next, state: "hidden" },
				type: DataActionTypes.SetHeaderButtonState,
			})
		}
	}, [disabled, inactive, dispatch])

	const onRegenerate = useCallback(() => {
		kycDao?.kycDao.regenerateNftImageOptions().then((options) => {
			const images = [] as Nft[]
			setCurrentArt(undefined)

			dispatch({
				payload: { button: HeaderButtons.next, state: "hidden" },
				type: DataActionTypes.SetHeaderButtonState,
			})

			Object.entries(options).forEach(([, url]) => {
				const splitUrl = url.split("/")

				if (splitUrl.length > 0) {
					const id = splitUrl[splitUrl.length - 1]

					images.push({
						url: url + "?timestamp=" + Date.now(),
						id,
					})
					setNftImages(images)
				}
			})
		})
	}, [kycDao?.kycDao, dispatch])

	const body = useCallback<StepPart>(
		({ disabled }) => (
			<NftImageWrapper>
				{nftImages.map(({ id, url }) => {
					return (
						<NftImageContainer
							selected={currentArt === id}
							key={id}
							onClick={onArtClick(id)}>
							<img alt="Nft" src={url} />
						</NftImageContainer>
					)
				})}
			</NftImageWrapper>
		),
		[nftImages, onArtClick, currentArt]
	)

	const footer = useCallback<StepPart>(
		({ disabled, inactive, onEnter }) => {
			return (
				<>
					<NftButtonWrapper>
						<Button
							mode="underline"
							inactive={inactive}
							disabled={disabled}
							fullWidth
							centered
							onClick={onRegenerate}>
							<i className="material-icons">refresh</i>
							<span>regenerate</span>
						</Button>
					</NftButtonWrapper>
					<SubmitButton
						black
						fullWidth
						autoFocus={!inactive && !disabled && !!currentArt}
						disabled={disabled || !currentArt}
						onClick={onEnter}
						inactive={inactive}
						label={kycDao?.kycDao.subscribed ? "Mint free kycNFT" : "Submit"}
					/>
				</>
			)
		},
		[currentArt, onRegenerate, kycDao?.kycDao.subscribed]
	)

	if (!kycDao) {
		return <H1>Error</H1>
	}

	return (
		<Step
			onPrev={onPrev}
			inactive={inactive}
			disabled={disabled}
			onTransitionDone={onTransitionDone}
			animation={animation}
			className={className}
			header={Header}
			body={body}
			footer={footer}
			onEnter={onSubmit}
		/>
	)
}
