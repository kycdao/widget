import { KycDao, SdkConfiguration } from '@kycdao/kycdao-sdk'
import { FC, useEffect, useReducer, useState } from 'react'
import { KycDaoContext, KycDaoState } from './components/kycDao.provider'
import { StepID, reducer, StateContext, DefaultData, OnClose, DataActionTypes } from './components/stateContext'
import { Loading } from './pages/loading'
import './style/style.scss'
import { Header } from './components/header/header'
import './fonts.scss'
import { IframeOptions } from './KycDaoClient'
// import 'material-icons'
import { Router } from './router'

export type KycDaoModalProps = {
    width?: number | string
    height?: number | string
    config: SdkConfiguration
    iframeOptions?: IframeOptions
}

export const KycDaoModal: FC<KycDaoModalProps> = ({
    height = 650,
    width = 400,
    config,
    iframeOptions
}) => {
    const [data, dispatch] = useReducer(reducer, DefaultData)
    const [kycDao, setKycDao] = useState<KycDaoState>()

    useEffect(() => {
        KycDao.initialize(config).then((results) => {
            setKycDao({ ...results, width, height })
        })
    }, [])

    useEffect(() => {
        const close = OnClose.subscribe(() => {
            window.parent.postMessage({ type: 'kycDaoCloseModal' }, iframeOptions?.messageTargetOrigin || window.location.origin)
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
            <div style={{ width, height }}>
                <Header />
                <Router />
            </div>
        </StateContext.Provider>
    </KycDaoContext.Provider>
}

export default KycDaoModal
