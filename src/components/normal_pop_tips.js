import GenComponent from "../gen_optimizer/gen_component";
import {appendHtml, e} from "../gen_optimizer/gen_utils";

export default class NormalPopTips extends GenComponent {
    constructor(scene) {
        super(scene)
        this.show = false
    }

    setupEvents(confirm, cancel) {
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
                "action.confirm": function (target, event) {
                    confirm()
                    self.close()
                },
                "action.cancel": function (target, event) {
                    cancel()
                    self.close()
                }
            }
        }]
        sc.registerGlobalEvents(events)
    }

    template() {
        return `
        <div id="normal-pop-tips" class="gen-pop-tips el-popover el-popper">
            <div class="el-popconfirm">
                <p class="el-popconfirm__main" style="margin-bottom: 10px">
                    <i class="el-popconfirm__icon el-icon-question" style="color: rgb(255, 153, 0);"></i>
                    确认删除？
                </p>
                <div class="el-popconfirm__action">
                    <button data-value="action.cancel" type="button" class="el-button el-button--text el-button--mini">取消</button>
                    <button data-value="action.confirm" type="button" class="el-button el-button--primary el-button--mini">确定</button>
                </div>
                <div x-arrow="" class="popper__arrow" style="left: 100.5px;"></div>   
            </div>
        </div>
        `
    }

    builder(target) {
        this.show = true
        e('.gen-pop-tips')?.remove()
        appendHtml(e('body'), this.template())
        let tipTool = e('.gen-pop-tips')
        let targetRect = target.getBoundingClientRect()
        let targetHeight = target.offsetHeight

        let tipToolHeight = tipTool.offsetHeight
        let left = targetRect.right + 5
        let top = targetRect.top + (targetHeight / 2) - (tipToolHeight / 2)

        tipTool.style.left = left + 'px'
        tipTool.style.top = top + 'px'
        tipTool.style.display = "block"
    }

    buildWith(target, confirm, cancel) {
        this.builder(target)
        this.setupEvents(confirm, cancel)
    }

    close() {
        this.show = false
        e('.gen-pop-tips').remove()
    }
}