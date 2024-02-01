import GenComponent from "../gen_optimizer/gen_component";
import {appendHtml, e} from "../gen_optimizer/gen_utils";

export default class SettingPopTips extends GenComponent {
    constructor(scene, title, style) {
        super(scene)
        this.show = false
        this.title = title
        this.style = style
    }

    setupEvents(callback) {
        super.setupEvents()
        let self = this
        let sc = self.scene
        sc.registerPageClass({
            'genPopTips': 'gen-pop-tips'
        })
        let events = [{
            eventName: 'click',
            className: sc.pageClass.genPopTips,
            configToEvents: {
                "action.updateConfig": function (target, event) {
                    let updatedVal = e("#pop-tips-input").value
                    if (updatedVal && updatedVal.length > 0) {
                        callback(updatedVal)
                    }
                    self.close()
                }
            }
        }]
        sc.registerGlobalEvents(events)
    }

    template(input) {
        return `
        <div class="gen-pop-tips el-popover el-popper" x-placement="right" style="${this.style == null ? '' : this.style}">            
            <p style="font-size: 12px; margin-bottom: 10px;">${this.title}</p>
            <div style="font-size: 12px; margin-bottom: 10px;" class="el-input el-input--mini">
                <input id="pop-tips-input" class="gen-input el-input__inner" onfocus="this.select()" value="${input == null ? '' : input}">
            </div>
            <div style="font-size: 12px;width: max-content;">
                <button data-value="action.updateConfig" class="el-button el-button--primary el-button--mini">
                    确定
                </button>
            </div>
            <div x-arrow="" class="popper__arrow" style="transform: translateY(-50%);"></div>   
        </div>
        `
    }

    builder(target) {
        e('.gen-pop-tips')?.remove()
        this.show = true
        appendHtml(e('body'), this.template(target.innerText))
        let tipTool = e('.gen-pop-tips')
        let targetRect = target.getBoundingClientRect()
        let targetHeight = target.offsetHeight

        let tipToolHeight = tipTool.offsetHeight
        let left = targetRect.right
        let top = targetRect.top + (targetHeight / 2) - (tipToolHeight / 2)

        tipTool.style.left = left + 'px'
        tipTool.style.top = top + 'px'
        tipTool.style.display = "block"
    }

    buildWith(target, callback) {
        this.builder(target)
        this.setupEvents(callback)
    }

    close() {
        this.show = false
        e('.gen-pop-tips').remove()
    }

}