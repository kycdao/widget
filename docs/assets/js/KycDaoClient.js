function KycDaoClient(url, width, height, parent) {
    this.parent = parent || document.body
    this.url = url
    this.width = width || 400
    this.height = height || 650
    this.modal = null
    this.isOpen = false
    this.onOutsideClick = (function (event) {
        if (this.modal && event.target !== this.modal) {
            this.close()
        }
    }).bind(this)
}

KycDaoClient.prototype.open = function () {
    this.modal = document.createElement('div')
    this.modal.className = "KycDaoModal"

    const modalContent = document.createElement('div')
    this.modal.className = "modal-content"

    const modalBody = document.createElement('div')
    modalBody.className = 'modal-body'

    const iframe = document.createElement('iframe')
    iframe.allow = "encrypted-media; camera"
    iframe.style = "border: 0px"
    iframe.src = this.url
    iframe.width = this.width
    iframe.height = this.height

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
    this.isOpen = false
}

window.KycDaoClient = KycDaoClient