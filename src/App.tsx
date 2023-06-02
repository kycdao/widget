import {
  KycDaoInitializationResult,
  SdkConfiguration,
} from "@kycdao/kycdao-sdk"
import { FC, useCallback, useEffect, useMemo, useState } from "react"

import { AppContainer } from "./AppContainer"
import { RestartContext } from "@Components/restartContext"
import { GlobalStyles } from "./styles/globalStyles"

export type KycDaoModalProps = {
  width?: number | string
  height?: number | string
  config: SdkConfiguration
  iframeOptions?: { messageTargetOrigin: string }
  isModal: boolean
  grantFlowEnabled?: boolean
  onReady?: (kycDaoSdkInstance: KycDaoInitializationResult) => void
}

export const KycDaoModal: FC<KycDaoModalProps> = (props) => {
  useEffect(() => {
    if (props.iframeOptions && "virtualKeyboard" in navigator) {
      navigator.virtualKeyboard.overlaysContent = true
    }
  }, [props.iframeOptions])

  const messageTargetOrigin = useMemo(
    () => props.iframeOptions?.messageTargetOrigin || window.location.origin,
    [props.iframeOptions]
  )

  const [key, setKey] = useState(Date.now())

  const RestartApp = useCallback(() => {
    setKey(Date.now())
  }, [])

  return (
    <RestartContext.Provider value={RestartApp}>
      <AppContainer
        messageTargetOrigin={messageTargetOrigin}
        key={key}
        {...props}
      />

      <GlobalStyles />
    </RestartContext.Provider>
  )
}

export default KycDaoModal
