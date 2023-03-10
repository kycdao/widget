import { KycDaoInitializationResult } from "@kycdao/kycdao-sdk"

export interface KycDaoEvent extends Event {
	data: any
}

export interface KycDaoOnReadyEvent extends KycDaoEvent {
	data: KycDaoInitializationResult
}

export enum KycDaoEventTypes {
	READY = "KycDaoIframeWidgetOnReady",
	FAIL = "KycDaoIframeWidgetOnFail",
	SUCCESS = "KycDaoIframeWidgetOnSuccess",
}

export type OnFailCallback = (error?: string) => void
export type OnSuccessCallback = (data?: string) => void
export type OnReadyCallback = (data: KycDaoInitializationResult) => void
