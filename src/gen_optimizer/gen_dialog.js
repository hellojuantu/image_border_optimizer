import GenComponent from "./gen_component";
import {appendHtml, e, sel} from "./gen_utils";

export default class GenDialog extends GenComponent {
    constructor(scene, title, contentHtml, actionHtml, callback) {
        super(scene);
        this.title = title
        this.contentHtml = contentHtml
        this.actionHtml = actionHtml
        this.dialogClassName = 'dialog'
        this.callback = callback
    }

    setupEvents() {
        super.setupEvents()
        let self = this
        let sc = self.scene
        sc.registerPageClass({
            "dialogFooter": "dialog-footer",
            "dialogClose": "dialog-close",
            "dialogContent": "dialog-content",
        })
        let events = [
            {
                eventName: 'click',
                className: sc.pageClass.dialogClose,
                configToEvents: {
                    "action.close": function (target) {
                        self.close()
                    },
                }
            }
        ]
        sc.registerGlobalEvents(events)
    }

    template() {
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
                    ${this.actionHtml}
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
        this.callback(this)
    }

    show() {
        const dialog = e(sel(this.dialogClassName))
        dialog.classList.add('dialog-show')
        setTimeout(() => dialog.classList.add('dialog-appear'))
    }

    close() {
        const dialog = e(sel(this.dialogClassName))
        dialog.classList.remove('dialog-appear')
        setTimeout(() => {
            dialog.classList.remove('dialog-show')
            dialog.remove()
        }, 400)
    }
}