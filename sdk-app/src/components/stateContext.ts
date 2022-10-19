import { createContext } from "react";

export type Data = {
    chain?: string
    email: string
    taxResidency: string
    currentPage: number
    termsAccepted: boolean
    verifyingModalOpen: boolean
}

export enum DataActionTypes {
    chainChange,
    nexPage,
    prevPage,
    emailChange,
    taxResidenceChange,
    termsAcceptedChange,
    setVerifyingModalOpen
}

export type SetVerifyingModalOpen = {
    type: DataActionTypes.setVerifyingModalOpen
    payload: boolean
}


export type ChainChangeAction = {
    type: DataActionTypes.chainChange
    payload: string
}

export type EmailChangeAction = {
    type: DataActionTypes.emailChange
    payload: string
}

export type NextPageAction = {
    type: DataActionTypes.nexPage
    payload: StepID
}

export type PrevPageAction = {
    type: DataActionTypes.prevPage
    payload: StepID
}

export type TaxResidentChangeAction = {
    type: DataActionTypes.taxResidenceChange
    payload: string
}

export type TermsAcceptedChangeAction = {
    type: DataActionTypes.termsAcceptedChange
    payload: boolean
}

export type DataChangeActions = SetVerifyingModalOpen | TermsAcceptedChangeAction | ChainChangeAction | EmailChangeAction | NextPageAction | PrevPageAction | TaxResidentChangeAction

export enum StepID {
    AgreementStep,
    kycDAOMembershipStep,
    verificationStep,
    emailDiscordVerificationStep,
    taxResidenceStep,
    beginVerificationStep,
    nftArtSelection,
    finalStep,
    chainSelection,
    termsAccepted
}

export const reducer = (data: Data, { payload, type }: DataChangeActions): Data => {
    switch (type) {
        case DataActionTypes.chainChange:
            return { ...data, chain: payload }
        case DataActionTypes.emailChange:
            return { ...data, email: payload }
        case DataActionTypes.nexPage:
            return { ...data, currentPage: payload }
        case DataActionTypes.taxResidenceChange:
            return { ...data, taxResidency: payload }
        case DataActionTypes.termsAcceptedChange:
            return { ...data, termsAccepted: payload }
        case DataActionTypes.setVerifyingModalOpen:
            return { ...data, verifyingModalOpen: payload }
        default: {
            return data
        }
    }
}

export const StateContext = createContext<{ data: Data, dispatch: React.Dispatch<DataChangeActions> }>(
    {
        data: { currentPage: 0, email: '', taxResidency: '', termsAccepted: false, verifyingModalOpen: false },
        dispatch: () => { }
    })
