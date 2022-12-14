import { test, expect, Page } from "@playwright/test"

const WEBSDK_BASE_URL = process.env.WEBSDK_BASE_URL
	? process.env.WEBSDK_BASE_URL
	: "http://localhost:4002"

test.describe("kycDAO WebSdk Tests", () => {
	test.describe.serial("Test kyc verification flow", () => {
		// This is needed to make the page persistent between the test in this sequence.
		let page: Page
		test.beforeAll(async ({ browser }) => {
			page = await browser.newPage()
			await page.goto(WEBSDK_BASE_URL)
		})
		test("Test clicking the start button", async () => {
			await page
				.locator("button", { has: page.locator("//span[text()='Start']") })
				.click()
		})
		test("Test clicking the join button", async () => {
			await page
				.locator("button", { has: page.locator("//span[text()='Join']") })
				.click()
		})
	})
})
