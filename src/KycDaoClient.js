"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function KycDaoClient({ height = "400px", width = '650px', parent = document.body, onFail, onSuccess, iframeOptions, config, }) {
    this.config = config;
    this.iframeOptions = iframeOptions;
    this.width = typeof width === 'string' ? width : `${width}px`;
    this.height = typeof height === 'string' ? height : `${height}px`;
    this.isOpen = false;
    this.parent = parent;
    this.onFail = onFail;
    this.onSuccess = onSuccess;
    this.isSuccessful = false;
    this.onOutsideClick = this.onOutsideClick.bind(this);
    this.messageHndlr = this.messageHndlr.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
}
exports.default = KycDaoClient;
KycDaoClient.prototype.onOutsideClick = function (event) {
    if (this.modal && !event.composedPath().includes(document.getElementsByClassName('KycDaoModal').item(0))) {
        this.close();
        if (this.onFail) {
            this.onFail('cancelled');
        }
    }
};
KycDaoClient.prototype.messageHndlr = function ({ data: { data, type }, origin }) {
    if (!this.iframeOptions && origin === window.location.origin || (this.iframeOptions && origin === this.iframeOptions.messageTargetOrigin)) {
        switch (type) {
            case 'kycDaoCloseModal':
                if (this.onFail) {
                    this.onFail('cancelled');
                }
                if (this.isOpen) {
                    this.close();
                }
                break;
            case 'kycDaoSuccess':
                {
                    this.isSuccessful = true;
                    if (this.onSuccess) {
                        this.onSuccess(data);
                    }
                }
                break;
            case 'kycDaoFail': {
                if (this.onFail) {
                    this.onFail(data);
                }
            }
        }
    }
};
KycDaoClient.prototype.open = function () {
    if (!this.isOpen) {
        if (typeof this.parent === 'string') {
            const parentElement = document.querySelector(this.parent);
            if (!parentElement) {
                throw `There is no such element as '${this.parent}', check your parent selector string!`;
            }
            this.parent = parentElement;
        }
        this.modal = document.createElement('div');
        this.modal.classList.add("KycDaoModal");
        const modalContent = document.createElement('div');
        modalContent.classList.add("KycDaoModalContent");
        const modalBody = document.createElement('div');
        modalBody.className = 'modal-body';
        modalBody.classList.add("KycDaoModalBody");
        const container = this.iframeOptions ? document.createElement('iframe') : document.createElement('div');
        if (this.iframeOptions) {
            const container2 = container;
            if (!this.iframeOptions.url) {
                throw 'An URL is needed if you want to use an iframe! What do you want to display?';
            }
            container2.allow = "encrypted-media; camera";
            container2.style.border = "border: 0px";
            container2.src = this.iframeOptions.url;
            container2.style.width = this.width;
            container2.style.height = this.height;
        }
        container.classList.add('KycDaoModalIframe');
        modalBody.appendChild(container);
        modalContent.appendChild(modalBody);
        this.modal.appendChild(modalContent);
        this.parent.appendChild(this.modal);
        this.isOpen = true;
        setTimeout((() => {
            window.addEventListener('click', this.onOutsideClick);
            window.addEventListener('message', this.messageHndlr);
            if (!this.iframeOptions) {
                globalThis.BootstrapKycDaoModal({
                    config: this.config,
                    height: this.height,
                    parent: this.parent,
                    width: this.width,
                    onFail: this.onFail,
                    onSuccess: this.onSuccess
                });
            }
            else {
                globalThis.BootstrapKycDaoModal({
                    config: this.config,
                    height: this.height,
                    parent: this.parent,
                    width: this.width,
                    iframeOptions: this.iframeOptions,
                    onFail: this.onFail,
                    onSuccess: this.onSuccess
                });
            }
        }).bind(this), 0);
    }
};
KycDaoClient.prototype.close = function () {
    if (this.isOpen) {
        if (this.modal) {
            const parentNode = typeof this.parent !== 'string' ? this.parent : document.querySelector(this.parent);
            if (parentNode) {
                parentNode.removeChild(this.modal);
            }
        }
        window.removeEventListener('click', this.onOutsideClick);
        window.removeEventListener('message', this.messageHndlr);
        this.isOpen = false;
    }
};
global.KycDaoClient = KycDaoClient;
//# sourceMappingURL=KycDaoClient.js.map