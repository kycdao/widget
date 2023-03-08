import { KycDaoInitializationResult } from "@kycdao/kycdao-sdk"

export interface KycDaoEvent extends Event {
	data: any
}

export interface KycDaoOnReadyEvent extends KycDaoEvent {
	data: KycDaoInitializationResult
}
