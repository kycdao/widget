import type {
	KycDaoInitializationResult,
	VerificationType,
} from "@kycdao/kycdao-sdk"
import { KycDaoClientOptions } from "StandaloneClientCommon"

export enum KycDaoMessageTypes {
	READY = "KycDaoIframeWidgetOnReady",
	FAIL = "KycDaoIframeWidgetOnFail",
	SUCCESS = "KycDaoIframeWidgetOnSuccess",
	REGISTERORLOGIN = "KycDaoIframeWidgetRegisterOrLogin",
	MINT = "KycDaoIframeWidgetMint",
}

export type KycDaoOnReadyData = KycDaoInitializationResult
export type KycDaoOnFailData = string
export type KycDaoOnSuccessData = string
export type KycDaoOnRegisterOrLoginData =
	KycDaoClientOptions["config"]["enabledBlockchainNetworks"][0]
export type KycDaoOnMintData = {
	disclaimerAccepted: boolean
	verificationType?: VerificationType
	imageId: string
	subscriptionYears?: number
	chainNetwork: string
}

export interface KycDaoMessage extends MessageEvent {
	data: {
		type: KycDaoMessageTypes
		data:
			| KycDaoOnFailData
			| KycDaoOnSuccessData
			| KycDaoOnReadyData
			| KycDaoOnMintData
			| KycDaoOnRegisterOrLoginData
	}
}

export interface KycDaoOnReadyMessage extends KycDaoMessage {
	data: {
		type: KycDaoMessageTypes.READY
		data: KycDaoOnReadyData
	}
}

export interface KycDaoOnFailMessage extends KycDaoMessage {
	data: {
		type: KycDaoMessageTypes.FAIL
		data: KycDaoOnFailData
	}
}

export interface KycDaoOnSuccessMessage extends KycDaoMessage {
	data: {
		type: KycDaoMessageTypes.SUCCESS
		data: KycDaoOnSuccessData
	}
}

export interface KycDaoOnRegisterOrLogin extends KycDaoMessage {
	data: {
		type: KycDaoMessageTypes.REGISTERORLOGIN
		data: KycDaoOnRegisterOrLoginData
	}
}

export interface KycDaoOnMint extends KycDaoMessage {
	data: {
		type: KycDaoMessageTypes.MINT
		data: KycDaoOnMintData
	}
}

export function isOnReadyMessage(
	event: KycDaoMessage
): event is KycDaoOnReadyMessage {
	return (
		typeof event.data !== "string" &&
		event.data.type === KycDaoMessageTypes.READY
	)
}

export function isOnFailMessage(
	event: KycDaoMessage
): event is KycDaoOnFailMessage {
	return (
		typeof event.data !== "string" &&
		event.data.type === KycDaoMessageTypes.FAIL
	)
}

export function isOnSuccessMessage(
	event: KycDaoMessage
): event is KycDaoOnSuccessMessage {
	return (
		typeof event.data !== "string" &&
		event.data.type === KycDaoMessageTypes.SUCCESS
	)
}

export function isOnRegisterOrLogin(
	event: KycDaoMessage
): event is KycDaoOnRegisterOrLogin {
	return (
		typeof event.data !== "string" &&
		event.data.type === KycDaoMessageTypes.REGISTERORLOGIN
	)
}

export function isOnMint(event: KycDaoMessage): event is KycDaoOnMint {
	return (
		typeof event.data !== "string" &&
		event.data.type === KycDaoMessageTypes.MINT
	)
}

export type OnFailCallback = (error?: string) => void
export type OnSuccessCallback = (data?: string) => void
export type OnReadyCallback = (data: KycDaoInitializationResult) => void
