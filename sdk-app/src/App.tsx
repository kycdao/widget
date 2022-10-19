import { KycDao, SdkConfiguration } from '@kycdao/kycdao-sdk';
import { FC, useEffect, useReducer, useState } from 'react';
import { KycDaoContext, KycDaoState } from './components/kycDao.provider';
import { StepID, reducer, Data, StateContext } from './components/stateContext';
import { BeginVerifyingStep } from './pages/beginVerifying';
import { ChainSelection } from './pages/chainSelectionStep';
import { AgreementStep } from './pages/connectStep';
import { EmailDiscordVerificationStep } from './pages/emailDiscordVerificationStep';
import { FinalStep } from './pages/finalStep';
import { KycDAOMembershipStep } from './pages/membershipStep';
import { NftSelection } from './pages/nftArtSelection';
import { TaxResidenceStep } from './pages/taxResidence';
import { VerificationStep } from './pages/verificationStep';
import './style/style.scss';

export const StepSelector: FC<{ stepID: StepID }> = ({ stepID }) => {
    switch (stepID) {
        case StepID.AgreementStep: {
            return <AgreementStep />
        }
        case StepID.kycDAOMembershipStep: {
            return <KycDAOMembershipStep />
        }
        case StepID.verificationStep: {
            return <VerificationStep />
        }
        case StepID.emailDiscordVerificationStep: {
            return <EmailDiscordVerificationStep />
        }
        case StepID.taxResidenceStep: {
            return <TaxResidenceStep />
        }
        case StepID.beginVerificationStep: {
            return <BeginVerifyingStep />
        }
        case StepID.nftArtSelection: {
            return <NftSelection />
        }
        case StepID.chainSelection: {
            return <ChainSelection />
        }
        case StepID.finalStep: {
            return <FinalStep />
        }
        default: {
            return <>Something went wrong</>
        }
    }
}

export type KycDaoModalProps = {
    width?: number | string
    height?: number | string
}

export const KycDaoModal: FC<KycDaoModalProps & SdkConfiguration> = ({ 
    baseUrl,
    enabledVerificationTypes,
    height = 400,
    width = 650,
    apiKey,
    demoMode,
    enabledBlockchainNetworks,
    environment,
    evmProvider }) => {
    const [data, dispatch] = useReducer(reducer, { currentPage: StepID.AgreementStep, email: '', verifyingModalOpen: false } as Data)
    const [kycDao, setKycDao] = useState<KycDaoState>()

    useEffect(() => {
        KycDao.initialize({
            baseUrl,
            enabledVerificationTypes,
            apiKey,
            demoMode,
            enabledBlockchainNetworks,
            environment,
            evmProvider
        }).then((results) => {
            setKycDao({ ...results, width, height })
        })
    }, [])

    if (!kycDao) {
        return <>Loading...</>
    }

    const { currentPage } = data

    return <KycDaoContext.Provider value={kycDao}>
            <StateContext.Provider value={{ data, dispatch }} >
                <StepSelector stepID={currentPage} />
            </StateContext.Provider>
        </KycDaoContext.Provider>
}

export default KycDaoModal;
