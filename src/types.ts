import { KycDaoInitializationResult } from "@kycdao/kycdao-sdk"

export enum KycDaoMessageTypes {
	READY = "KycDaoIframeWidgetOnReady",
	FAIL = "KycDaoIframeWidgetOnFail",
	SUCCESS = "KycDaoIframeWidgetOnSuccess",
}

export type KycDaoOnReadyData = KycDaoInitializationResult
export type KycDaoOnFailData = string
export type KycDaoOnSuccessData = string

export interface KycDaoMessage extends MessageEvent {
	data: {
		type: KycDaoMessageTypes
		data: KycDaoOnFailData | KycDaoOnSuccessData | KycDaoOnReadyData
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

export type OnFailCallback = (error?: string) => void
export type OnSuccessCallback = (data?: string) => void
export type OnReadyCallback = (data: KycDaoInitializationResult) => void
