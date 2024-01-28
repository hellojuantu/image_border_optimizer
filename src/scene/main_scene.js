import GenScene from "../gen_optimizer/gen_scene"
import {e, log, toggleClass} from "../gen_optimizer/gen_utils";
import TextControls from "../controls/text_controls";
import PanelControls from "../controls/panel_controls";
import PenControls from "../controls/pen_controls";
import ShapeControls from "../controls/shape_controls";
import PageConfigControls from "../controls/page_config_controls"

export default class MainScene extends GenScene {
    constructor(optimizer) {
        super(optimizer)
        this.setup()
    }

    setup() {
        // 画板控制器
        let imageControl = PanelControls.new(this).addElement()
        // 画笔控制器
        let penControl = PenControls.new(this).addElement()
        // 形状控制器
        let shapeControl = ShapeControls.new(this).addElement()
        // 文字控制器
        let textControl = TextControls.new(this, shapeControl).addElement()
        // 页面控制器
        PageConfigControls.new(this, imageControl, penControl, textControl, shapeControl)
    }

    pageLoading() {
        document.onreadystatechange = () => {
            if (document.readyState == "complete") {
                log('____ complete')
                // e('#id-loading-area').remove()
                toggleClass(e("#id-loading-area"), "hide")
                e('body').classList.remove('hide')
            }
        }
    }
}