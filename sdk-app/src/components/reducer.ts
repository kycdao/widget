export type Data = {
    chain?: string
    email: string
    taxResidence?: string
    idIssuer?: string
    currentPage: number
}

export enum DataActionTypes {
    chainChange,
    nexPage,
    prevPage,
    emailChange,
    taxResidenceChange,
    idIssuerChange
}

export type ChainChangeAction = {
    type: DataActionTypes.chainChange
    payload: string
}

export type EmailChangeAction = {
    type: DataActionTypes.emailChange
    payload: string
}

export type IdIssuerChangeAction = {
    type: DataActionTypes.idIssuerChange
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

export type DataChangeActions = ChainChangeAction | EmailChangeAction | IdIssuerChangeAction | NextPageAction | PrevPageAction | TaxResidentChangeAction

export enum StepID {
    AgreementStep,
    kycDAOMembershipStep,
    verificationStep,
    emailDiscordVerificationStep,
    taxResidenceStep,
    beginVerificationStep,
    nftArtSelection,
    finalStep,
    chainSelection
  }
  
export  const reducer = (data: Data, { payload, type }: DataChangeActions): Data => {
    switch (type) {
        case DataActionTypes.chainChange:
            return { ...data, chain: payload }
        case DataActionTypes.emailChange:
            return { ...data, email: payload }
        case DataActionTypes.idIssuerChange:
            return { ...data, idIssuer: payload }
        case DataActionTypes.nexPage:
            return { ...data, currentPage: payload }
        case DataActionTypes.taxResidenceChange:
            return { ...data, taxResidence: payload }
        default: {
            return data
        }
    }
  }
  