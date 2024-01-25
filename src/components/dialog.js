import GenComponent from "../gen_optimizer/gen_component";
import {appendHtml, e, isBlank} from "../gen_optimizer/gen_utils";
import GenPersistConfigManager from "../gen_optimizer/gen_persisit_config_manager";

export default class Dialog extends GenComponent {
    constructor(scene) {
        super(scene);
        scene.registerPageClass({
            "dialogFooter": "dialog-footer",
            "dialogClose": "dialog-close",
            "dialogContent": "dialog-content",
        })
    }

    setupEvents() {
        super.setupEvents()
        let self = this
        let sc = self.scene
        sc.registerGlobalEvents([
            {
                eventName: 'click',
                className: sc.pageClass.dialogFooter,
                configToEvents: {
                    "action.cancel": function (target) {
                        self.close()
                    },
                    "action.confirm": function (target) {
                        let input = e("#apiKeyTinyPng")
                        const apiKey = input.value
                        if (isBlank(apiKey)) {
                            let dur = 1000
                            sc.message.error('输入不可为空', dur)
                            input.classList.add("dialog-error-input")
                            setTimeout(() => input.classList.remove('dialog-error-input'), dur)
                            return
                        }
                        GenPersistConfigManager.new().savePersistConfig("API_KEY.tinyPng", apiKey)
                        sc.message.success('设置成功')
                        self.close()
                    },
                    "action.clear": function (target) {
                        GenPersistConfigManager.new().savePersistConfig("API_KEY.tinyPng", '')
                        sc.message.success('清理成功')
                        self.close()
                    }
                }
            },
            {
                eventName: 'click',
                className: sc.pageClass.dialogClose,
                configToEvents: {
                    "action.close": function (target) {
                        self.close()
                    },
                }
            }
        ])
    }

    template() {
        this.title = '图片压缩设置'
        const apikey = GenPersistConfigManager.new().getPersistConfig("API_KEY.tinyPng")
        this.contentHtml = `
            <p class="el-form-item__label">Tiny Api Key:</p>
            <input id="apiKeyTinyPng" data-value="apiKey.tinyPng" autocomplete="off" class="gen-input el-input__inner" value=${apikey == null ? '' : apikey}>
        `
        this.dialogContainerSel = '.dialog'

        return `
        <div class="dialog">
            <div class="dialog-main">
                <div class="dialog-header">
                    <p class="el-dialog__title">${this.title}</p>                    
                    <button type="button" aria-label="Close" class="el-message-box__headerbtn dialog-close">
                        <i data-value="action.close" class="el-message-box__close el-icon-close"></i>
                    </button>
                </div>
                <div class="dialog-content">
                   ${this.contentHtml}
                </div>
                <div class="dialog-footer">
                    <button data-value="action.cancel" class="dialog-button el-button el-button--default is-plain el-button--small">取消</button>
                    <button data-value="action.clear" class="dialog-button el-button el-button--danger is-plain el-button--small">清空</button>
                    <button data-value="action.confirm" class="dialog-button el-button el-button--primary el-button--small">确定</button>
                </div>
            </div>
        </div>
        `
    }

    builder() {
        appendHtml(e('body'), this.template())
        this.show()
    }

    buildWith(...datas) {
        this.builder(...datas)
        this.setupEvents()
    }

    show() {
        const dialog = e(this.dialogContainerSel)
        dialog.classList.add('dialog-show')
        setTimeout(() => dialog.classList.add('dialog-appear'))
    }

    close() {
        const dialog = e(this.dialogContainerSel)
        dialog.classList.remove('dialog-appear')
        setTimeout(() => {
            dialog.classList.remove('dialog-show')
            dialog.remove()
        }, 400)
    }
}