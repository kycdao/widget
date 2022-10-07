import React, { FC, StrictMode, useReducer } from 'react';
import './App.css';
import { StateContext } from './components/stateContext';
import { AgreementStep } from './pages/connectStep';
import { KycDAOMembershipStep } from './pages/steps';
import { reducer } from './components/reducer';
import { ErrorBoundary } from 'react-error-boundary'

export enum StepID {
    AgreementStep,
    kycDAOMembershipStep
}

export const StepSelector: FC<{ stepID: StepID }> = ({ stepID }) => {
    switch (stepID) {
        case StepID.AgreementStep: {
            return <AgreementStep />
        }
        case StepID.kycDAOMembershipStep: {
            return <KycDAOMembershipStep />
        }
        default: {
            return <>Something went wrong</>
        }
    }
}

export const App: FC = () => {
    const [data, dispatch] = useReducer(reducer, { currentPage: StepID.AgreementStep })

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
