import { KycDao, SdkConfiguration } from '@kycdao/kycdao-sdk';
import { FC, useContext, useEffect, useReducer, useState } from 'react';
import { KycDaoContext, KycDaoState } from './components/kycDao.provider';
import { StepID, reducer, StateContext, DefaultData, OnClose, DataActionTypes } from './components/stateContext';
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
import './fonts.css'

const GetStep = ({ stepID, ...options }: { stepID: StepID, animation?: StepAnimation, disabled?: boolean, inactive?: boolean }) => {
    switch (stepID) {
        case StepID.AgreementStep: {
            return <AgreementStep {...options} />
        }
        case StepID.kycDAOMembershipStep: {
            return <KycDAOMembershipStep {...options} />
        }
        case StepID.verificationStep: {
            return <VerificationStep {...options} />
        }
        case StepID.emailDiscordVerificationStep: {
            return <EmailDiscordVerificationStep {...options} />
        }
        case StepID.taxResidenceStep: {
            return <TaxResidenceStep {...options} />
        }
        case StepID.beginVerificationStep: {
            return <BeginVerifyingStep />
        }
        case StepID.nftArtSelection: {
            return <NftSelection {...options} />
        }
        case StepID.chainSelection: {
            return <ChainSelection {...options} />
        }
        case StepID.finalStep: {
            return <FinalStep {...options} />
        }
        case StepID.loading: {
            return <Loading {...options} />
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

export const Router: FC = () => {
    const { data: { prevPage, nextPage, currentPage } } = useContext(StateContext)

    return <div style={{ display: 'block', width: '800px', height: '586px' }}>
        {prevPage ? GetStep({ stepID: prevPage, animation: { from: 'moving-center', to: 'moving-out' }, inactive: true }) : null}
        {GetStep({
            stepID: currentPage,
            animation: (prevPage || nextPage) ? {
                to: 'moving-center',
                from: GetMovingAnimation(prevPage, nextPage)
            } : undefined
        })}
        {nextPage ? GetStep({ stepID: nextPage, animation: { from: 'moving-center', to: 'moving-in' }, inactive: true }) : null}
    </div>
}

export type KycDaoModalProps = {
    width?: number | string
    height?: number | string
    messageTargetOrigin?: string
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
    messageTargetOrigin,
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
        const close = OnClose.subscribe(() => {
            window.parent.postMessage({ type: 'kycDaoCloseModal'}, messageTargetOrigin || window.location.origin)
        })
        return close.unsubscribe.bind(close)
    }, [])

    useEffect(() => {
        if (kycDao) {
            dispatch({ payload: { current: StepID.AgreementStep, prev: StepID.loading }, type: DataActionTypes.changePage })
        }
    }, [kycDao])

    if (!kycDao) {
        return <Loading />
    }

    return <KycDaoContext.Provider value={kycDao}>
        <StateContext.Provider value={{ data, dispatch }} >
            <Header />
            <Router />
        </StateContext.Provider>
    </KycDaoContext.Provider>
}

export default KycDaoModal;
