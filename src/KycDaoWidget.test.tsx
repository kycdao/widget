import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { KycDaoWidget } from "./KycDaoWidget"
import {
	KycDao,
	BlockchainNetworks,
	SdkConfiguration,
	MintingData,
	MintingResult,
	NftCheckOptions,
	NftCheckResponse,
	VerificationData,
	VerificationTypes,
	VerificationProviderOptions,
	RedirectEvent,
} from "@kycdao/kycdao-sdk"
import { afterEach, describe, expect, Mocked, test, vi } from "vitest"
// Uncomment the following line to use the tracing proxy
// import { createTracingProxy } from "@Utils/testUtils"

declare type KycDaoReduced = Pick<
	KycDao,
	| "connectWallet"
	| "checkEmailConfirmed"
	| "hasValidNft"
	| "getValidNfts"
	| "registerOrLogin"
	| "checkVerificationStatus"
	| "updateEmail"
	| "startVerification"
	| "getNftImageOptions"
	| "startMinting"
	| "sdkStatus"
	| "connectedWallet"
	| "subscribed"
>

declare type KycDaoInitializationResultMock = {
	kycDao: Mocked<KycDaoReduced>
	redirectEvent?: RedirectEvent
	mintingResult?: MintingResult
}

const kir: KycDaoInitializationResultMock = {
	kycDao: {
		connectWallet: vi.fn((blockchain: "Solana" | "Ethereum" | "Near") => {
			kir.mintingResult = undefined
			vi.spyOn(kir.kycDao, "connectedWallet", "get").mockReturnValue({
				blockchain: "Ethereum",
				blockchainNetwork: kir.kycDao.sdkStatus.availableBlockchainNetworks[0],
				address: "0x4242424242424242424242424242424242424242",
			})
			return Promise.resolve()
		}),
		checkEmailConfirmed: vi.fn(() => {
			return Promise.resolve({ isConfirmed: false })
		}),
		hasValidNft: vi.fn(
			(
				_verificationType: keyof typeof VerificationTypes,
				_options?: NftCheckOptions
			) => {
				return Promise.resolve(false)
			}
		),
		getValidNfts: vi.fn(
			(
				_verificationType: keyof typeof VerificationTypes,
				_options?: NftCheckOptions
			) => {
				return Promise.resolve<NftCheckResponse>({
					networkAndAddress: undefined!,
					hasValidNft: false,
					tokens: [],
				})
			}
		),
		registerOrLogin: vi.fn(() => {
			return Promise.resolve()
		}),
		checkVerificationStatus: vi.fn(() => {
			return Promise.resolve({ KYC: false })
		}),
		updateEmail: vi.fn((email: string) => {
			return Promise.resolve()
		}),
		startVerification: vi.fn(
			(
				_verificationData: VerificationData,
				providerOptions?: VerificationProviderOptions
			) => {
				setTimeout(() => {
					providerOptions?.personaOptions?.onComplete?.()
				}, 0)
				return Promise.resolve()
			}
		),
		getNftImageOptions: vi.fn(() => {
			return Promise.resolve<{
				[imageId: string]: string
			}>({
				id1: "img1",
				id2: "img2",
				id3: "img3",
				id4: "img4",
			})
		}),
		startMinting: vi.fn((mintingData: MintingData) => {
			const mr = {
				imageUrl: "img1",
				tokenId: "t1",
				transactionUrl: "tx1",
			}

			kir.mintingResult = mr

			return Promise.resolve<MintingResult>(mr)
		}),
		sdkStatus: {
			availableBlockchainNetworks: ["PolygonMumbai"],
			baseUrl: "https://mock.to/",
			demoMode: false,
			availableVerificationTypes: [VerificationTypes.KYC],
			evmProviderConfigured: true,
			nearNetworkConnected: null,
			solanaNetworkConnected: null,
		},
		get connectedWallet() {
			return undefined
		},
		get subscribed() {
			return false
		},
	},
	redirectEvent: undefined,
	mintingResult: undefined,
}

vi.mock("@kycdao/kycdao-sdk", async () => {
	const actual = await vi.importActual<typeof import("@kycdao/kycdao-sdk")>(
		"@kycdao/kycdao-sdk"
	)
	return {
		...actual,
		KycDao: {
			...actual.KycDao,
			// use createTracingProxy(kir) for debugging
			initialize: vi.fn(() => Promise.resolve(kir)),
		},
	}
})

afterEach(() => {
	vi.restoreAllMocks()
})

class StepTest {
	btns?: HTMLElement[]

	constructor(
		readonly name: string,
		private readonly heading: string,
		private readonly interact: () => Promise<void> = async () => {},
		private readonly afternext: () => Promise<void> = async () => {}
	) {}

	async parse(): Promise<void> {
		await screen.findByRole("heading", {
			name: new RegExp(this.heading, "i"),
		})
		this.btns = await screen.findAllByRole("button", {
			name: /arrow_forward arrow_forward/i,
		})
	}

	async next(): Promise<void> {
		if (this.btns) {
			await this.interact()

			const lastBtn = this.btns?.[this.btns?.length - 1]
			await waitFor(() => expect(lastBtn).not.toHaveAttribute("disabled"))
			await userEvent.click(lastBtn)
			await this.afternext()
		} else {
			throw new Error("No btns found")
		}
	}
}

const INITIAL_STEP = new StepTest(
	"INITIAL_STEP",
	"the last proof you need in web3."
)
const MEMBERSHIP_STEP = new StepTest("MEMBERSHIP_STEP", "kycdao membership")
const VERIFY_STEP = new StepTest("VERIFY_STEP", "Verify account")
const TAX_RESIDENCE_STEP = new StepTest(
	"TAX_RESIDENCE_STEP",
	"Tax residence",
	async () => {
		const country = await screen.findByText(/angola/i)
		await userEvent.click(country)
	},
	async () => {}
)
const OPEN_ACCOUNT_STEP = new StepTest("OPEN_ACCOUNT_STEP", "Open account")
const NFT_SELECT_STEP = new StepTest(
	"NFT_SELECT_STEP",
	"Select your KYC NFT art",
	async () => {
		const nfts = await screen.findAllByRole("img", { name: /nft/i })
		await userEvent.click(nfts[0])
	}
)
const MINT_MEMBERSHIP_STEP = new StepTest(
	"MINT_MEMBERSHIP_STEP",
	"Mint membership"
)
const FINAL_STEP = new StepTest("FINAL_STEP", "congrats!")
const FINAL_STEP_ALREADY_HAVE = new StepTest(
	"FINAL_STEP_ALREADY_HAVE",
	"You already have a kycNFT on"
)
const EMAIL_STEP = new StepTest(
	"EMAIL_STEP",
	"Confirm your email",
	async () => {
		const input = await screen.findByRole("textbox")
		await userEvent.type(input, "name@email.com")
	},
	async () => {
		await screen.findByText(/waiting for email confirmation/i)
		kir.kycDao.checkEmailConfirmed.mockImplementation(() =>
			Promise.resolve({ isConfirmed: true })
		)
		await screen.findByRole(
			"heading",
			{ name: /Open account/i },
			{ timeout: 5000 }
		)
	}
)
const WELCOME_BACK_STEP = new StepTest("WELCOME_BACK", "Welcome back to kycDAO")

async function flow(...steps: StepTest[]) {
	for (const step of steps) {
		try {
			await step.parse()
			await step.next()
		} catch (e) {
			console.error(`Failed at step: ${step.name}`)
			throw e
		}
	}
}

const config: SdkConfiguration = {
	demoMode: true,
	enabledBlockchainNetworks: [BlockchainNetworks.PolygonMumbai],
	enabledVerificationTypes: [VerificationTypes.KYC],
	baseUrl: "https://staging.kycdao.xyz",
	evmProvider: {},
}

test("returning user flow subscribed", async () => {
	render(<KycDaoWidget config={config} />)

	kir.kycDao.checkVerificationStatus.mockImplementation(() => {
		return Promise.resolve({ KYC: true })
	})

	vi.spyOn(kir.kycDao, "subscribed", "get").mockReturnValue(true)

	await waitFor(() => expect(KycDao.initialize).toHaveBeenCalled())

	expect(kir.kycDao.connectWallet).toHaveBeenCalled()
	expect(kir.kycDao.hasValidNft).toHaveBeenCalled()
	expect(kir.kycDao.registerOrLogin).toHaveBeenCalled()

	await flow(WELCOME_BACK_STEP, NFT_SELECT_STEP, FINAL_STEP)
}, 10000)

test("returning user flow", async () => {
	render(<KycDaoWidget config={config} />)

	kir.kycDao.checkVerificationStatus.mockImplementation(() => {
		return Promise.resolve({ KYC: true })
	})

	await waitFor(() => expect(KycDao.initialize).toHaveBeenCalled())

	expect(kir.kycDao.connectWallet).toHaveBeenCalled()
	expect(kir.kycDao.hasValidNft).toHaveBeenCalled()
	expect(kir.kycDao.registerOrLogin).toHaveBeenCalled()

	await flow(
		INITIAL_STEP,
		MEMBERSHIP_STEP,
		VERIFY_STEP,
		NFT_SELECT_STEP,
		MINT_MEMBERSHIP_STEP,
		FINAL_STEP
	)
}, 10000)

test("new user flow", async () => {
	render(<KycDaoWidget config={config} />)

	await waitFor(() => expect(KycDao.initialize).toHaveBeenCalled())

	expect(kir.kycDao.connectWallet).toHaveBeenCalled()
	expect(kir.kycDao.hasValidNft).toHaveBeenCalled()
	expect(kir.kycDao.registerOrLogin).toHaveBeenCalled()

	await flow(
		INITIAL_STEP,
		MEMBERSHIP_STEP,
		VERIFY_STEP,
		EMAIL_STEP,
		OPEN_ACCOUNT_STEP,
		TAX_RESIDENCE_STEP,
		NFT_SELECT_STEP,
		MINT_MEMBERSHIP_STEP,
		FINAL_STEP
	)
}, 10000)

test("has NFT flow", async () => {
	kir.kycDao.hasValidNft.mockImplementation(
		(
			verificationType: keyof typeof VerificationTypes,
			options?: NftCheckOptions
		) => {
			return Promise.resolve(true)
		}
	)

	kir.kycDao.getValidNfts.mockImplementation(
		(
			verificationType: keyof typeof VerificationTypes,
			options?: NftCheckOptions
		) => {
			return Promise.resolve<NftCheckResponse>({
				networkAndAddress: {
					blockchainNetwork: BlockchainNetworks.PolygonMumbai,
					address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
				},
				hasValidNft: false,
				tokens: [
					{
						name: "token1",
						description: "description1",
						image: "img1",
					},
				],
			})
		}
	)

	render(<KycDaoWidget config={config} />)

	await waitFor(() => expect(KycDao.initialize).toHaveBeenCalled())

	expect(kir.kycDao.connectWallet).toHaveBeenCalled()
	expect(kir.kycDao.hasValidNft).toHaveBeenCalled()

	await flow(FINAL_STEP_ALREADY_HAVE)
}, 10000)

describe("NEAR", async () => {
	test("new user flow (NearLogin)", async () => {
		// @ts-ignore
		kir.redirectEvent = "NearLogin" as RedirectEvent

		render(<KycDaoWidget config={config} />)

		await waitFor(() => expect(KycDao.initialize).toHaveBeenCalled())

		expect(kir.kycDao.connectWallet).toHaveBeenCalled()
		expect(kir.kycDao.hasValidNft).toHaveBeenCalled()
		expect(kir.kycDao.registerOrLogin).toHaveBeenCalled()

		await flow(
			INITIAL_STEP,
			MEMBERSHIP_STEP,
			VERIFY_STEP,
			EMAIL_STEP,
			OPEN_ACCOUNT_STEP,
			TAX_RESIDENCE_STEP,
			NFT_SELECT_STEP,
			MINT_MEMBERSHIP_STEP,
			FINAL_STEP
		)
	})

	test("mint redirect (NearMint)", async () => {
		// @ts-ignore
		kir.redirectEvent = "NearMint" as RedirectEvent

		render(<KycDaoWidget config={config} />)

		await waitFor(() => expect(KycDao.initialize).toHaveBeenCalled())

		expect(kir.kycDao.connectWallet).toHaveBeenCalled()
		expect(kir.kycDao.hasValidNft).toHaveBeenCalled()
		expect(kir.kycDao.registerOrLogin).toHaveBeenCalled()

		await flow(FINAL_STEP)
	})

	test("user rejection (NearUserRejectedError)", async () => {
		// @ts-ignore
		kir.redirectEvent = "NearUserRejectedError" as RedirectEvent
		const onFail = vi.fn()

		render(<KycDaoWidget onFail={onFail} config={config} />)

		await waitFor(() => expect(onFail).toHaveBeenCalled())
	})
})
