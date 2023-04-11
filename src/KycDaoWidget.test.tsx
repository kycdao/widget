import {
	act,
	queries,
	render,
	screen,
	waitFor,
	waitForElementToBeRemoved,
} from "@testing-library/react"
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
import { afterEach, beforeEach, describe, expect, it, test, vi } from "vitest";

const trace = () => new Error("").stack?.split("\n")?.splice(3).join("\n")

const kir = {
	kycDao: {
		connectWallet: vi.fn((blockchain: "Solana" | "Ethereum" | "Near") => {
			return Promise.resolve()
		}),
		checkEmailConfirmed: vi.fn(() => {
			return Promise.resolve({ isConfirmed: false })
		}),
		hasValidNft: vi.fn(
			(
				verificationType: keyof typeof VerificationTypes,
				options?: NftCheckOptions
			) => {
				return Promise.resolve(false)
			}
		),
		getValidNfts: vi.fn(
			(
				verificationType: keyof typeof VerificationTypes,
				options?: NftCheckOptions
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
				verificationData: VerificationData,
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

			kir.mintingResult = mr as any

			return Promise.resolve<MintingResult>(mr)
		}),
		sdkStatus: {
			availableBlockchainNetworks: ["PolygonMumbai"],
		},
		connectedWallet: false,
		subscribed: false,
	},
	redirectEvent: undefined,
	mintingResult: undefined,
}

class TracingProxy<T extends object> implements ProxyHandler<T> {
	private static traceGet = false
	private static traceSet = false
	private static traceCalls = false
	private static showStackTraces = false
	private constructor(
		private readonly target: T,
		private readonly prefix: string
	) {}

	get(obj: T, prop: string | symbol) {
		const value = Reflect.get(obj, prop)
		const exists = obj.hasOwnProperty(prop)

		if (!exists) {
			if (prop !== "then") {
				console.error(
					`Accessing non-existent property: ${this.prefix}${prop.toString()}`
				)
				console.log(trace())
			}
		}

		if (typeof value === "object" && value !== null) {
			return TracingProxy.create(value, prop.toString() + ".")
		} else if (typeof value === "function") {
			return TracingProxy.create(value, prop.toString())
		} else {
			if (TracingProxy.traceGet) {
				console.log(
					`Accessing property: ${this.prefix}${prop.toString()} = ${value}`
				)
				if (TracingProxy.showStackTraces) {
					console.log(trace())
				}
			}
			return value
		}
	}

	set(target: T, p: string | symbol, newValue: any, receiver: any): boolean {
		if (TracingProxy.traceSet) {
			console.log(`Setting property: ${this.prefix}${p.toString()}`)
			if (TracingProxy.showStackTraces) {
				console.log(trace())
			}
		}
		return Reflect.set(target, p, newValue, receiver)
	}

	apply(target: T & Function, thisArg: any, argArray: any[]) {
		if (TracingProxy.traceCalls) {
			console.log(`Calling function: ${this.prefix}(${argArray.join(", ")})`)
			if (TracingProxy.showStackTraces) {
				console.log(trace())
			}
		}
		const ret = Reflect.apply(target, thisArg, argArray)
		if (TracingProxy.traceCalls) {
			if (ret instanceof Promise) {
				ret.then((x) => {
					console.log(`Return value promise: ${JSON.stringify(x)}`)
				})
			} else {
				console.log(`Return value: ${JSON.stringify(ret)}`)
			}
		}
		return ret
	}

	public static create<T extends object>(target: T, name: string = ""): T {
		return new Proxy(target, new TracingProxy(target, name))
	}
}

vi.mock("@kycdao/kycdao-sdk", async () => {
	const actual = await vi.importActual<typeof import("@kycdao/kycdao-sdk")>(
		"@kycdao/kycdao-sdk"
	)
	return {
		...actual,
		KycDao: {
			...actual.KycDao,
			initialize: vi.fn(() => Promise.resolve(TracingProxy.create(kir))),
		},
	}
})

afterEach(() => {
	vi.restoreAllMocks()
})

function runTimers() {
	// 	act(() => {
	// 		vi.runOnlyPendingTimers()
	// 	})
}

class StepTest {
	btns?: HTMLElement[]
	constructor(
		private readonly name: string,
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
		console.log(`ON ${this.name}`)
	}
	async next(): Promise<void> {
		if (this.btns) {
			await this.interact()

			const lastBtn = this.btns?.[this.btns?.length - 1]
			await waitFor(() => expect(lastBtn).not.toHaveAttribute("disabled"))
			await userEvent.click(lastBtn)
			await this.afternext()
			runTimers()
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
		runTimers()
		await screen.findByRole(
			"heading",
			{ name: /Open account/i },
			{ timeout: 5000 }
		)
	}
)

const config: SdkConfiguration = {
	demoMode: true,
	enabledBlockchainNetworks: [BlockchainNetworks.PolygonMumbai],
	enabledVerificationTypes: [VerificationTypes.KYC],
	baseUrl: "https://staging.kycdao.xyz",
	evmProvider: {},
}

test("returning user flow", async () => {
	render(<KycDaoWidget config={config} />)

	kir.kycDao.checkVerificationStatus.mockImplementation(() => {
		return Promise.resolve({ KYC: true })
	})
	await waitFor(() => expect(KycDao.initialize).toHaveBeenCalled())
	await waitFor(() => expect(kir.kycDao.connectWallet).toHaveBeenCalled())
	await waitFor(() => expect(kir.kycDao.hasValidNft).toHaveBeenCalled())
	await waitFor(() => expect(kir.kycDao.registerOrLogin).toHaveBeenCalled())

	await INITIAL_STEP.parse()
	await INITIAL_STEP.next()

	await MEMBERSHIP_STEP.parse()
	await MEMBERSHIP_STEP.next()

	await VERIFY_STEP.parse()
	await VERIFY_STEP.next()

	await NFT_SELECT_STEP.parse()
	await NFT_SELECT_STEP.next()

	await MINT_MEMBERSHIP_STEP.parse()
	await MINT_MEMBERSHIP_STEP.next()

	await FINAL_STEP.parse()
	await FINAL_STEP.next()
}, 10000)

test("new user flow", async () => {
	render(<KycDaoWidget config={config} />)

	await waitFor(() => expect(KycDao.initialize).toHaveBeenCalled())
	await waitFor(() => expect(kir.kycDao.connectWallet).toHaveBeenCalled())
	await waitFor(() => expect(kir.kycDao.hasValidNft).toHaveBeenCalled())
	await waitFor(() => expect(kir.kycDao.registerOrLogin).toHaveBeenCalled())

	await INITIAL_STEP.parse()
	await INITIAL_STEP.next()

	await MEMBERSHIP_STEP.parse()
	await MEMBERSHIP_STEP.next()

	await VERIFY_STEP.parse()
	await VERIFY_STEP.next()

	await EMAIL_STEP.parse()
	await EMAIL_STEP.next()

	await OPEN_ACCOUNT_STEP.parse()
	await OPEN_ACCOUNT_STEP.next()

	await TAX_RESIDENCE_STEP.parse()
	await TAX_RESIDENCE_STEP.next()

	await NFT_SELECT_STEP.parse()
	await NFT_SELECT_STEP.next()

	await MINT_MEMBERSHIP_STEP.parse()
	await MINT_MEMBERSHIP_STEP.next()

	await FINAL_STEP.parse()
	await FINAL_STEP.next()
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
	await waitFor(() => expect(kir.kycDao.connectWallet).toHaveBeenCalled())
	await waitFor(() => expect(kir.kycDao.hasValidNft).toHaveBeenCalled())

	await FINAL_STEP_ALREADY_HAVE.parse()
	await FINAL_STEP_ALREADY_HAVE.next()
}, 10000)

describe("NEAR", async () => {
	test("new user flow (NearLogin)", async () => {
		// @ts-ignore
		kir.redirectEvent = 'NearLogin' as RedirectEvent

		await render(<KycDaoWidget config={config} />)

		await waitFor(() => expect(KycDao.initialize).toHaveBeenCalled())
		await waitFor(() => expect(kir.kycDao.connectWallet).toHaveBeenCalled())
		await waitFor(() => expect(kir.kycDao.hasValidNft).toHaveBeenCalled())
		await waitFor(() => expect(kir.kycDao.registerOrLogin).toHaveBeenCalled())

		await INITIAL_STEP.parse()
		await INITIAL_STEP.next()

		await MEMBERSHIP_STEP.parse()
		await MEMBERSHIP_STEP.next()

		await VERIFY_STEP.parse()
		await VERIFY_STEP.next()

		await EMAIL_STEP.parse()
		await EMAIL_STEP.next()

		await OPEN_ACCOUNT_STEP.parse()
		await OPEN_ACCOUNT_STEP.next()

		await TAX_RESIDENCE_STEP.parse()
		await TAX_RESIDENCE_STEP.next()

		await NFT_SELECT_STEP.parse()
		await NFT_SELECT_STEP.next()

		await MINT_MEMBERSHIP_STEP.parse()
		await MINT_MEMBERSHIP_STEP.next()

		await FINAL_STEP.parse()
		await FINAL_STEP.next()
	})

	test("mint redirect (NearMint)", async () => {
		// @ts-ignore
		kir.redirectEvent = 'NearMint' as RedirectEvent

		await render(<KycDaoWidget config={config} />)

		await waitFor(() => expect(KycDao.initialize).toHaveBeenCalled())
		await waitFor(() => expect(kir.kycDao.connectWallet).toHaveBeenCalled())
		await waitFor(() => expect(kir.kycDao.hasValidNft).toHaveBeenCalled())
		await waitFor(() => expect(kir.kycDao.registerOrLogin).toHaveBeenCalled())

		await FINAL_STEP.parse()
		await FINAL_STEP.next()
	})

	test("user rejection (NearUserRejectedError)", async () => {
		// @ts-ignore
		kir.redirectEvent = 'NearUserRejectedError' as RedirectEvent
		const onFail = vi.fn()

		await render(<KycDaoWidget onFail={onFail} config={config} />)

		await waitFor(() => expect(onFail).toHaveBeenCalled())
	})
})
