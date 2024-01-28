import GenComponent from "../gen_optimizer/gen_component";
import {appendHtml, e} from "../gen_optimizer/gen_utils";

export default class SettingPopTips extends GenComponent {
    constructor(scene) {
        super(scene)
        this.show = false
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

    template() {
        return `
        <div class="gen-pop-tips el-popover el-popper">            
            <p style="font-size: 12px; margin-bottom: 10px;">修改设置为:</p>
            <div style="font-size: 12px; margin-bottom: 10px;" class="el-input el-input--mini">
                <input id="pop-tips-input" class="gen-input el-input__inner">
            </div>
            <div style="font-size: 12px;width: max-content;">
                <button data-value="action.updateConfig" class="el-button el-button--primary el-button--mini">
                    确定
                </button>
            </div>
            <div x-arrow="" class="popper__arrow" style="left: 100.5px;"></div>   
        </div>
        `
    }

    builder(target) {
        e('.gen-pop-tips')?.remove()
        this.show = true
        appendHtml(e('body'), this.template());
        let tipTool = e('.gen-pop-tips');
        let targetRect = target.getBoundingClientRect();
        let targetHeight = target.offsetHeight;

        let tipToolHeight = tipTool.offsetHeight;
        let left = targetRect.right + 10
        let top = targetRect.top + (targetHeight / 2) - (tipToolHeight / 2)

        tipTool.style.left = left + 'px';
        tipTool.style.top = top + 'px';
        tipTool.style.display = "block";
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