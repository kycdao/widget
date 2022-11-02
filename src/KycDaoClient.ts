import { SdkConfiguration } from "@kycdao/kycdao-sdk"

export default class KycDaoClient {
    protected modal?: HTMLElement
    protected isOpen: boolean

    protected width = "400px"
    protected height = "650px"

    public get Open() {
        return this.isOpen
    }

    public get Width() {
        return this.width
    }

    public get Height () {
        return this.height
    }

    public get EnabledBlockchainNetworks() {
        return this.enabledBlockchainNetworks
    }

    public get EnabledVerificationTypes() {
        return this.enabledVerificationTypes
    }

    public constructor(
        protected enabledBlockchainNetworks: SdkConfiguration["enabledBlockchainNetworks"],
        protected enabledVerificationTypes: SdkConfiguration["enabledVerificationTypes"],
        width?: number | string,
        height?: number | string,
        protected parent: HTMLElement | string = document.body,
        protected demoMode = true,
        protected isIframe = true,
        protected url?: string,
        protected messageTargetOrigin?: string,
        public onFail?: (reason: string) => void,
        public onSuccess?: (data: string | null) => void
    ) {

        this.messageTargetOrigin = messageTargetOrigin

        this.width = typeof width === 'string' ? width : `${width}px`
        this.height = typeof height === 'string' ? height : `${height}px`

        this.isOpen = false
    }

    protected onOutsideClick = (event: MouseEvent) => {
        if (this.modal && !event.composedPath().includes(document.getElementsByClassName('KycDaoModal').item(0) as EventTarget)) {
            this.close()
            if (this.onFail) {
                this.onFail('cancelled')
            }
        }
    }

    protected messageHndlr = ({ origin, data: { data, type } }: { origin: string, data: { data: string, type: 'kycDaoCloseModal' | 'kycDaoSuccess' | 'kycDaoFail' } }) => {
        if ( this.url ? origin === this.url : true) {
            switch (type) {
                case 'kycDaoCloseModal':
                    if (this.onFail) {
                        this.onFail('cancelled')
                    }
                    this.close()
                    break
                case 'kycDaoSuccess': {
                    if (this.onSuccess) {
                        this.onSuccess(data)
                    }
                }
                    break
                case 'kycDaoFail': {
                    if (this.onFail) {
                        this.onFail(data)
                    }
                }
            }
        }
    }

    public open = () => {
        if (typeof this.parent === 'string') {
            const parentElement = document.querySelector(this.parent) as HTMLElement | null
            if (!parentElement) {
                throw `There is no such element as '${this.parent}', check your parent selector string!`
            }

            this.parent = parentElement
        }

        this.modal = document.createElement('div')
        this.modal.classList.add("KycDaoModal")

        const modalContent = document.createElement('div')
        modalContent.classList.add("KycDaoModalContent")

        const modalBody = document.createElement('div')
        modalBody.className = 'modal-body'
        modalBody.classList.add("KycDaoModalBody")

        const container = this.isIframe ? document.createElement('iframe') : document.createElement('div')
        if (this.isIframe) {
            const container2 = container as HTMLIFrameElement

            if (!this.url) {
                throw 'An URL is needed if you want to use an iframe! What do you want to display?'
            }

            container2.allow = "encrypted-media; camera"
            container2.style.border = "border: 0px"
            container2.src = this.url
            container2.style.width = this.width
            container2.style.height = this.height
        }
        container.classList.add('KycDaoModalIframe')

        modalBody.appendChild(container)
        modalContent.appendChild(modalBody)
        this.modal.appendChild(modalContent)

        this.parent.appendChild(this.modal)
        this.isOpen = true

        setTimeout(() => {
            window.addEventListener('click', this.onOutsideClick)
            window.addEventListener('message', this.messageHndlr)
            if (!this.isIframe) {
                globalThis.BootstrapKycDaoModal(
                    container,
                    this.height,
                    this.width,
                    this.demoMode,
                    this.enabledBlockchainNetworks,
                    this.enabledVerificationTypes,
                    this.messageTargetOrigin)
            } else {
                globalThis.BootstrapKycDaoModal(
                    container,
                    this.height,
                    this.width,
                    this.demoMode,
                    this.enabledBlockchainNetworks,
                    this.enabledVerificationTypes,
                    this.messageTargetOrigin)
            }
        }, 0);
    }

    public close = () => {
        if (this.modal) {
            if (typeof this.parent !== 'string') {
                this.parent.removeChild(this.modal)
            }
        }

        window.removeEventListener('click', this.onOutsideClick)
        window.removeEventListener('message', this.messageHndlr)
        this.isOpen = false
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).KycDaoClient = KycDaoClient.constructor