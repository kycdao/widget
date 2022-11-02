declare module '@kycdao/kycdao-web-sdk/App' {
  import { SdkConfiguration } from '@kycdao/kycdao-sdk';
  import { FC } from 'react';
  import './style/style.scss';
  import './fonts.css';
  export const Router: FC;
  export type KycDaoModalProps = {
      width?: number | string;
      height?: number | string;
      messageTargetOrigin?: string;
  };
  export const KycDaoModal: FC<KycDaoModalProps & SdkConfiguration>;
  export default KycDaoModal;

}
declare module '@kycdao/kycdao-web-sdk/KycDaoClient' {
  import { SdkConfiguration } from "@kycdao/kycdao-sdk";
  export default class KycDaoClient {
      protected enabledBlockchainNetworks: SdkConfiguration["enabledBlockchainNetworks"];
      protected enabledVerificationTypes: SdkConfiguration["enabledVerificationTypes"];
      protected parent: HTMLElement | string;
      protected demoMode: boolean;
      protected isIframe: boolean;
      protected url?: string | undefined;
      protected messageTargetOrigin?: string | undefined;
      onFail?: ((reason: any) => void) | undefined;
      onSuccess?: ((data: any) => void) | undefined;
      protected modal?: HTMLElement;
      protected isOpen: boolean;
      protected width: string;
      protected height: string;
      get Open(): boolean;
      get Width(): string;
      get Height(): string;
      get EnabledBlockchainNetworks(): ("SolanaDevnet" | "SolanaMainnet" | "SolanaTestnet" | "NearMainnet" | "NearTestnet" | "EthereumGoerli" | "EthereumMainnet" | "PolygonMainnet" | "PolygonMumbai")[] | undefined;
      get EnabledVerificationTypes(): ("KYC" | "AccreditedInvestor")[];
      constructor(enabledBlockchainNetworks: SdkConfiguration["enabledBlockchainNetworks"], enabledVerificationTypes: SdkConfiguration["enabledVerificationTypes"], width?: number | string, height?: number | string, parent?: HTMLElement | string, demoMode?: boolean, isIframe?: boolean, url?: string | undefined, messageTargetOrigin?: string | undefined, onFail?: ((reason: any) => void) | undefined, onSuccess?: ((data: any) => void) | undefined);
      protected onOutsideClick: (event: MouseEvent) => void;
      protected messageHndlr: ({ origin, data: { data, type } }: {
          origin: string;
          data: {
              data: any;
              type: 'kycDaoCloseModal' | 'kycDaoSuccess' | 'kycDaoFail';
          };
      }) => void;
      open: () => void;
      close: () => void;
  }

}
declare module '@kycdao/kycdao-web-sdk/components/button/button' {
  import { CSSProperties, FC } from "react";
  import './button.scss';
  export type ButtonProps = {
      onClick?: () => void;
      className?: string;
      disabled?: boolean;
      style?: CSSProperties;
      label: string;
      inactive?: boolean;
  };
  export const Button: FC<ButtonProps>;

}
declare module '@kycdao/kycdao-web-sdk/components/header/header' {
  import { FC } from "react";
  import './header.scss';
  export const Header: FC;

}
declare module '@kycdao/kycdao-web-sdk/components/input/input.component' {
  import { FC } from 'react';
  import './input.component.scss';
  type InputProps = {
      placeholder: string;
      onChange?: (value: string) => void;
      disabled?: boolean;
      id?: string;
      className?: string;
      value?: string;
      autoCompleteData?: string[];
      autoFocus?: boolean;
  };
  export const Input: FC<InputProps>;
  export {};

}
declare module '@kycdao/kycdao-web-sdk/components/kycDao.provider' {
  /// <reference types="react" />
  import { KycDaoInitializationResult } from '@kycdao/kycdao-sdk';
  export type KycDaoState = KycDaoInitializationResult & {
      width?: number | string;
      height?: number | string;
  };
  export const KycDaoContext: import("react").Context<KycDaoState | undefined>;

}
declare module '@kycdao/kycdao-web-sdk/components/placeholder/placeholder' {
  import { CSSProperties, FC } from "react";
  import './placeholder.css';
  export type PlaceholderProps = {
      width: string;
      height: string;
      onClick?: () => void;
      style?: CSSProperties;
  };
  export const Placeholder: FC<PlaceholderProps>;

}
declare module '@kycdao/kycdao-web-sdk/components/select/option' {
  import { FC, PropsWithChildren } from "react";
  import './input.component.scss';
  export const Option: FC<PropsWithChildren>;

}
declare module '@kycdao/kycdao-web-sdk/components/select/select' {
  import { FC, PropsWithChildren } from 'react';
  import './input.component.scss';
  type InputProps = {
      placeholder?: string;
      onChange: (value: string) => void;
      disabled?: boolean;
      id?: string;
      className?: string;
      value?: string;
      values: {
          value: string;
          label: string;
      }[];
  };
  export const Select: FC<PropsWithChildren<InputProps>>;
  export {};

}
declare module '@kycdao/kycdao-web-sdk/components/stateContext' {
  /// <reference types="react" />
  export type HeaderButtonState = 'enabled' | 'disabled' | 'hidden';
  export const OnNext: import("rxjs/internal/Observable").Observable<void>;
  export const OnPrev: import("rxjs/internal/Observable").Observable<void>;
  export const OnClose: import("rxjs/internal/Observable").Observable<void>;
  export type Data = {
      chain?: string;
      email: string;
      taxResidency: string;
      currentPage: number;
      prevPage?: number;
      nextPage?: number;
      reversePaging?: boolean;
      termsAccepted: boolean;
      verifyingModalOpen: boolean;
      prevButtonState: HeaderButtonState;
      nextButtonState: HeaderButtonState;
      closeButtonState: HeaderButtonState;
      messageTargetOrigin?: string;
  };
  export enum DataActionTypes {
      chainChange = 0,
      changePage = 1,
      prevPage = 2,
      emailChange = 3,
      taxResidenceChange = 4,
      termsAcceptedChange = 5,
      SetHeaderButtonState = 6,
      setVerifyingModalOpen = 7,
      OnClickHeaderButton = 8
  }
  export enum HeaderActionTypes {
      setNextButtonState = 0,
      setPrevButtonState = 1,
      setCloseButtonState = 2
  }
  export enum HeaderButtons {
      prev = 0,
      next = 1,
      close = 2
  }
  export type SetVerifyingModalOpen = {
      type: DataActionTypes.setVerifyingModalOpen;
      payload: boolean;
  };
  export type ChainChangeAction = {
      type: DataActionTypes.chainChange;
      payload: string;
  };
  export type EmailChangeAction = {
      type: DataActionTypes.emailChange;
      payload: string;
  };
  export type ChangePageAction = {
      type: DataActionTypes.changePage;
      payload: {
          next?: StepID;
          current: StepID;
          prev?: StepID;
          reversePaging?: boolean;
      };
  };
  export type TaxResidentChangeAction = {
      type: DataActionTypes.taxResidenceChange;
      payload: string;
  };
  export type TermsAcceptedChangeAction = {
      type: DataActionTypes.termsAcceptedChange;
      payload: boolean;
  };
  export type SetHeaderButtonStateAction = {
      type: DataActionTypes.SetHeaderButtonState;
      payload: {
          state: HeaderButtonState;
          button: HeaderButtons;
      };
  };
  export type HeaderButtonClickAction = {
      type: DataActionTypes.OnClickHeaderButton;
      payload: {
          button: HeaderButtons;
      };
  };
  export type DataChangeActions = HeaderButtonClickAction | SetHeaderButtonStateAction | SetHeaderButtonStateAction | SetVerifyingModalOpen | TermsAcceptedChangeAction | ChainChangeAction | EmailChangeAction | ChangePageAction | TaxResidentChangeAction;
  export enum StepID {
      AgreementStep = 1,
      kycDAOMembershipStep = 2,
      verificationStep = 3,
      emailDiscordVerificationStep = 4,
      taxResidenceStep = 5,
      beginVerificationStep = 6,
      nftArtSelection = 7,
      finalStep = 8,
      chainSelection = 9,
      termsAccepted = 10,
      loading = 11
  }
  export const reducer: (data: Data, { payload, type }: DataChangeActions) => Data;
  export const DefaultData: Data;
  export const StateContext: import("react").Context<{
      data: Data;
      dispatch: React.Dispatch<DataChangeActions>;
  }>;

}
declare module '@kycdao/kycdao-web-sdk/components/step/step' {
  import { FC, PropsWithChildren } from "react";
  import './step.scss';
  export type MovingDirection = "moving-out" | "moving-in" | "moving-center";
  export type StepAnimation = {
      from: MovingDirection;
      to: MovingDirection;
  };
  export type StepState = 'inTransition' | 'transitionDone';
  type StepProps = {
      header?: (props: {
          disabled: boolean;
          inactive: boolean;
      }) => JSX.Element;
      footer?: (props: {
          disabled: boolean;
          inactive: boolean;
      }) => JSX.Element;
      body?: (props: {
          disabled: boolean;
          inactive: boolean;
      }) => JSX.Element;
      onEnter?: () => void;
      className?: string;
      disabled: boolean;
      stepState?: StepState;
      animation?: StepAnimation;
      onTransitionDone?: (newState: StepState) => void;
      inactive?: boolean;
  };
  export const Step: FC<PropsWithChildren<StepProps>>;
  export {};

}
declare module '@kycdao/kycdao-web-sdk/components/submitButton/submitButton' {
  import { CSSProperties, FC } from "react";
  import './button.scss';
  export type ButtonProps = {
      onClick?: () => void;
      className?: string;
      label?: string;
      disabled?: boolean;
      style?: CSSProperties;
      autoFocus?: boolean;
      inactive?: boolean;
  };
  export const SubmitButton: FC<ButtonProps>;

}
declare module '@kycdao/kycdao-web-sdk/components/toggleButton/toggleButton' {
  import { CSSProperties, FC } from "react";
  import './toggleButton.scss';
  export type ToggleButton = {
      onClick?: () => void;
      className?: string;
      label?: string;
      hoverLabel?: string;
      hideArrow?: boolean;
      disabled?: boolean;
      style?: CSSProperties;
      toggle?: boolean;
  };
  export const ToggleButton: FC<ToggleButton>;

}
declare module '@kycdao/kycdao-web-sdk/index' {
  import './style/style.scss';
  import './fonts.css';
  import './index.css';
  import { SdkConfiguration } from '@kycdao/kycdao-sdk';
  import "material-icons";
  export default function BootstrapKycDaoModal(element: string | HTMLElement, height: number | string, width: number | string, demoMode?: boolean, enabledBlockchainNetworks?: SdkConfiguration["enabledBlockchainNetworks"], enabledVerificationTypes?: SdkConfiguration["enabledVerificationTypes"], messageTargetOrigin?: string): void;

}
declare module '@kycdao/kycdao-web-sdk/pages/ErrorPage' {
  import { FC } from "react";
  import { FallbackProps } from "react-error-boundary";
  export const ErrorPage: FC<FallbackProps>;

}
declare module '@kycdao/kycdao-web-sdk/pages/agreementStep' {
  import { FC } from "react";
  import { PageProps } from "@kycdao/kycdao-web-sdk/pages/pageProps";
  export const AgreementStep: FC<PageProps>;

}
declare module '@kycdao/kycdao-web-sdk/pages/beginVerifying' {
  import { FC } from "react";
  export const BeginVerifyingStep: FC;

}
declare module '@kycdao/kycdao-web-sdk/pages/chainSelectionStep' {
  import { FC } from "react";
  import { PageProps } from "@kycdao/kycdao-web-sdk/pages/pageProps";
  export const ChainSelection: FC<PageProps>;

}
declare module '@kycdao/kycdao-web-sdk/pages/emailDiscordVerificationStep' {
  import { FC } from "react";
  import { PageProps } from "@kycdao/kycdao-web-sdk/pages/pageProps";
  export const EmailDiscordVerificationStep: FC<PageProps>;

}
declare module '@kycdao/kycdao-web-sdk/pages/finalStep' {
  import { FC } from "react";
  import { PageProps } from "@kycdao/kycdao-web-sdk/pages/pageProps";
  export const FinalStep: FC<PageProps>;

}
declare module '@kycdao/kycdao-web-sdk/pages/loading' {
  import { FC } from "react";
  import { PageProps } from "@kycdao/kycdao-web-sdk/pages/pageProps";
  export const Loading: FC<PageProps>;

}
declare module '@kycdao/kycdao-web-sdk/pages/membershipStep' {
  import { FC } from "react";
  import { PageProps } from "@kycdao/kycdao-web-sdk/pages/pageProps";
  export const KycDAOMembershipStep: FC<PageProps>;

}
declare module '@kycdao/kycdao-web-sdk/pages/nftArtSelection' {
  import { FC } from "react";
  import { PageProps } from "@kycdao/kycdao-web-sdk/pages/pageProps";
  export const NftSelection: FC<PageProps>;

}
declare module '@kycdao/kycdao-web-sdk/pages/pageProps' {
  import { StepAnimation } from "@kycdao/kycdao-web-sdk/components/step/step";
  export type PageProps = {
      className?: string;
      animation?: StepAnimation;
      disabled?: boolean;
      inactive?: boolean;
  };

}
declare module '@kycdao/kycdao-web-sdk/pages/taxResidence' {
  import { FC } from "react";
  import { PageProps } from "@kycdao/kycdao-web-sdk/pages/pageProps";
  export const TaxResidenceStep: FC<PageProps>;

}
declare module '@kycdao/kycdao-web-sdk/pages/verificationStep' {
  import { FC } from "react";
  import { PageProps } from "@kycdao/kycdao-web-sdk/pages/pageProps";
  export const VerificationStep: FC<PageProps>;

}
declare module '@kycdao/kycdao-web-sdk/setupTests' {
  import '@testing-library/jest-dom';

}
declare module '@kycdao/kycdao-web-sdk' {
  import main = require('@kycdao/kycdao-web-sdk/index');
  export = main;
}