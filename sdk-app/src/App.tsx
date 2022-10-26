import { KycDao, SdkConfiguration } from '@kycdao/kycdao-sdk';
import { FC, useContext, useEffect, useReducer, useState } from 'react';
import { KycDaoContext, KycDaoState } from './components/kycDao.provider';
import { StepID, reducer, StateContext, DefaultData } from './components/stateContext';
import { BeginVerifyingStep } from './pages/beginVerifying';
import { ChainSelection } from './pages/chainSelectionStep';
import { AgreementStep } from './pages/agreementStep';
import { EmailDiscordVerificationStep } from './pages/emailDiscordVerificationStep';
import { FinalStep } from './pages/finalStep';
import { Loading } from './pages/loading';
import { KycDAOMembershipStep } from './pages/membershipStep';
import { NftSelection } from './pages/nftArtSelection';
import { TaxResidenceStep } from './pages/taxResidence';
import { VerificationStep } from './pages/verificationStep';
import './style/style.scss';
import { MovingDirection, StepAnimation } from './components/step/step';
import { Header } from './components/header/header';

const GetStep = (stepID: StepID, animation?: StepAnimation, disabled = false) => {
    switch (stepID) {
        case StepID.AgreementStep: {
            return <AgreementStep disabled={disabled} animation={animation} />
        }
        case StepID.kycDAOMembershipStep: {
            return <KycDAOMembershipStep disabled={disabled} animation={animation} />
        }
        case StepID.verificationStep: {
            return <VerificationStep disabled={disabled} animation={animation} />
        }
        case StepID.emailDiscordVerificationStep: {
            return <EmailDiscordVerificationStep disabled={disabled} animation={animation} />
        }
        case StepID.taxResidenceStep: {
            return <TaxResidenceStep disabled={disabled} animation={animation} />
        }
        case StepID.beginVerificationStep: {
            return <BeginVerifyingStep disabled={disabled} animation={animation} />
        }
        case StepID.nftArtSelection: {
            return <NftSelection disabled={disabled} animation={animation} />
        }
        case StepID.chainSelection: {
            return <ChainSelection disabled={disabled} animation={animation} />
        }
        case StepID.finalStep: {
            return <FinalStep disabled={disabled} animation={animation} />
        }
        case StepID.loading: {
            return <Loading animation={animation} />
        }
        default: {
            return <>Something went wrong</>
        }
    }
}

function GetMovingAnimation(prevStep?: StepID, nextStep?: StepID): MovingDirection {
    if (prevStep) {
        return 'moving-in'
    } else if (nextStep) {
        return 'moving-out'
    }
    return 'moving-center'
}

export const StepSelector: FC = () => {
    const { data: { prevPage, nextPage, currentPage } } = useContext(StateContext)

    console.log(!!prevPage || !!nextPage)

    return <div style={{ display: 'block', width: '800px', height: '586px' }}>
        {prevPage ? GetStep(prevPage, { from: 'moving-center', to: 'moving-out' }, true) : null}
        {GetStep(currentPage, (!!prevPage || !!nextPage) ? { to: 'moving-center', from: GetMovingAnimation(prevPage, nextPage) } : undefined)}
        {nextPage ? GetStep(nextPage, { from: 'moving-center', to: 'moving-in' }, true) : null}
    </div>
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
    const [data, dispatch] = useReducer(reducer, DefaultData)
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

    useEffect(() => {
        const close = data.onClose.subscribe(() => window.parent.postMessage('closeModal', 'https://localhost:5000'))
        return close.unsubscribe.bind(close)
    }, [])

    if (!kycDao) {
        return <Loading />
    }

    return <KycDaoContext.Provider value={kycDao}>
        <StateContext.Provider value={{ data, dispatch }} >
            <Header />
            <StepSelector />
        </StateContext.Provider>
    </KycDaoContext.Provider>
}

export default KycDaoModal;
