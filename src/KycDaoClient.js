function KycDaoClient(url, width, height, parent, messageTargetOrigin) {
    this.messageTargetOrigin = messageTargetOrigin
    this.parent = parent || document.body
    this.url = url
    this.width = width || 400
    this.height = height || 650
    this.modal = null
    this.isOpen = false
    this.result = false
    this.onOutsideClick = (function (event) {
        if (this.modal && event.target !== this.modal.getElementsByClassName('KycDaoModalBody')) {
            this.close()
        }
    }).bind(this)
    this.messageHndlr = (function ({ origin, data }) {
        if (origin === this.url) {
            switch (data) {
                case 'kycDaoCloseModal':
                    this.close()
                    break
                case 'kycDaoSuccess': {
                    if (this.onSuccess) {
                        this.onSuccess(this.result)
                    }
                    this.close()
                }
                    break
                case 'kycDaoFail': {
                    if (this.onFail) {
                        this.onFail(this.result)
                    }
                    this.close()
                }
            }
        }
    }).bind(this)
    this.onSuccess = null
    this.onFail = null
}

KycDaoClient.prototype.open = function () {
    this.modal = document.createElement('div')
    this.modal.classList.add("KycDaoModal")

    const modalContent = document.createElement('div')
    modalContent.classList.add("KycDaoModalContent")

    const modalBody = document.createElement('div')
    modalBody.className = 'modal-body'
    modalBody.classList.add("KycDaoModalBody")

    const iframe = document.createElement('iframe')
    iframe.allow = "encrypted-media; camera"
    iframe.style = "border: 0px"
    iframe.src = this.url
    iframe.width = this.width
    iframe.height = this.height
    iframe.classList.add('KycDaoModalIframe')

    modalBody.appendChild(iframe)
    modalContent.appendChild(modalBody)
    this.modal.appendChild(modalContent)

    if (typeof this.parent === 'string') {
        this.parent = document.querySelector(this.parent)
    }

    this.parent.appendChild(this.modal)
    this.isOpen = true

    setTimeout(() => {
        window.addEventListener('click', this.onOutsideClick)
        window.addEventListener('message', this.messageHndlr)
    }, 0);
}

KycDaoClient.prototype.close = function () {
    if (this.modal) {
        if (this.parent) {
            this.parent.removeChild(this.modal)
        } else {
            document.removeChild(this.modal)
        }
    }

    window.removeEventListener('click', this.onOutsideClick)
    window.removeEventListener('message', this.closHndlr)
    this.isOpen = false
}

globalThis.KycDaoClient = KycDaoClient