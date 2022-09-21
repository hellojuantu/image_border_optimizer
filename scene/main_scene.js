class MainScene extends GenScene {
    constructor(optimizer) {
        super(optimizer)
        this.setup()
    }

    static new(...args) {
        return new this(...args)
    }

    setup() {        
        // 图片控制器
        let imageControl = ImageControls.new(this).addElement()
        // 画笔控制器
        let pen = PenControls.new(this).addElement()
        // 文字控制器
        let textControl = TextControls.new(this).addElement()
        // 页面控制器
        PageControls.new(this, imageControl, pen, textControl)
    }
}