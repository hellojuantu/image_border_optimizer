class MainScene extends GenScene {
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
}