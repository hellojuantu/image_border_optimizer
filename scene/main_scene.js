class MainScene extends GenScene {
    constructor(optimizer) {
        super(optimizer)
        this.setup()
    }

    setup() {        
        // 图片控制器
        let imageControl = ImageControls.new(this).addElement()
        // 画笔控制器
        let penControl = PenControls.new(this).addElement()
        // 文字控制器
        let textControl = TextControls.new(this).addElement()
        // 形状控制器
        let shapeControl = ShapeControls.new(this).addElement()
        // 页面控制器
        PageConfigControls.new(this, imageControl, penControl, textControl, shapeControl)
    }
}