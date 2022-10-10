import { FC, StrictMode, useReducer } from 'react';
import './App.css';
import { StateContext } from './components/stateContext';
import { Data, reducer, StepID } from './components/reducer';
import { ErrorBoundary } from 'react-error-boundary'
import { AgreementStep } from './components/connectStep';
import { EmailDiscordVerificationStep } from './components/emailDiscordVerificationStep';
import { KycDAOMembershipStep } from './components/membershipStep';
import { VerificationStep } from './components/verificationStep';
import { TaxResidenceStep } from './components/taxResidence';

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
        default: {
            return <>Something went wrong</>
        }
    }
}

export const App: FC = () => {
    const [data, dispatch] = useReducer(reducer, { currentPage: StepID.AgreementStep, email: '' } as Data)

    const { currentPage } = data

    return <StrictMode>
        <ErrorBoundary FallbackComponent={() => <>Something went wrong</>}>
            <StateContext.Provider value={{ data, dispatch }} >
                <StepSelector stepID={currentPage} />
            </StateContext.Provider>
        </ErrorBoundary>
    </StrictMode>
}

export default App;
