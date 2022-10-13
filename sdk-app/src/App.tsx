import { FC, useEffect, useReducer, useState } from 'react';
import './style/style.scss';
import { StateContext } from './components/stateContext';
import { Data, reducer, StepID } from './components/reducer';
import { ErrorBoundary } from 'react-error-boundary'
import { AgreementStep } from './components/connectStep';
import { EmailDiscordVerificationStep } from './components/emailDiscordVerificationStep';
import { KycDAOMembershipStep } from './components/membershipStep';
import { VerificationStep } from './components/verificationStep';
import { TaxResidenceStep } from './components/taxResidence';
import { BeginVerifyingStep } from './components/beginVerifying';
// import 'material-icons/iconfont/outlined.css';
import { NftSelection } from './components/nftArtSelection';
import { FinalStep } from './components/finalStep';
import { ChainSelection } from './components/chainSelectionStep';
import { BlockchainNetworks, KycDao, KycDaoInitializationResult, VerificationTypes } from '@kycdao/kycdao-sdk';
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
            enabledBlockchainNetworks: [BlockchainNetworks.NearTestnet, BlockchainNetworks.PolygonMumbai],
            enabledVerificationTypes: [VerificationTypes.KYC],
            demoMode: true,
            evmProvider: window.ethereum,
        }).then(setKycDao)
    }, [])

    if (!kycDao) {
        return <>Loading...</>
    }

    const { currentPage } = data

    return <ErrorBoundary FallbackComponent={() => <>Something went wrong</>}>
        <KycDaoContext.Provider value={kycDao}>
            <StateContext.Provider value={{ data, dispatch }} >
                <StepSelector stepID={currentPage} />
            </StateContext.Provider>
        </KycDaoContext.Provider>
    </ErrorBoundary>
}

export default App;
