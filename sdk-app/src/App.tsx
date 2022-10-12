import { createContext, FC, StrictMode, useEffect, useReducer, useState } from 'react';
import './App.css';
import { StateContext } from './components/stateContext';
import { Data, reducer, StepID } from './components/reducer';
import { ErrorBoundary } from 'react-error-boundary'
import { AgreementStep } from './components/connectStep';
import { EmailDiscordVerificationStep } from './components/emailDiscordVerificationStep';
import { KycDAOMembershipStep } from './components/membershipStep';
import { VerificationStep } from './components/verificationStep';
import { TaxResidenceStep } from './components/taxResidence';
import { BeginVerifyingStep } from './components/beginVerifying';
import 'material-icons/iconfont/outlined.css';
import { NftSelection } from './components/nftArtSelection';
import { FinalStep } from './components/finalStep';
import { ChainSelection } from './components/chainSelectionStep';
import { KycDao, KycDaoInitializationResult } from '@kycdao/kycdao-sdk';
import { KycDaoContext } from './components/kycDao.provider';

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

export const App: FC = () => {
    const [data, dispatch] = useReducer(reducer, { currentPage: StepID.AgreementStep, email: '' } as Data)
    const [kycDao, setKycDao] = useState<KycDaoInitializationResult>()

    useEffect(() => {
        KycDao.initialize({
            baseUrl: "https://staging.kycdao.xyz",
            enabledBlockchainNetworks: ["NearTestnet", "PolygonMumbai"],
            enabledVerificationTypes: ["KYC", "AccreditedInvestor"],
            demoMode: true,
            evmProvider: window.ethereum,
        }).then(setKycDao)
    }, [])

    if (!kycDao) {
        return <>Loading...</>
    }

    /* @TODO if(!kycDao.) {
        return <>Error</>
    }*/

    const { currentPage } = data

    return <StrictMode>
        <ErrorBoundary FallbackComponent={() => <>Something went wrong</>}>
            <KycDaoContext.Provider value={kycDao}>
                <StateContext.Provider value={{ data, dispatch }} >
                    <StepSelector stepID={currentPage} />
                </StateContext.Provider>
            </KycDaoContext.Provider>
        </ErrorBoundary>
    </StrictMode>
}

export default App;
