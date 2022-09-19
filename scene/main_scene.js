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
        ImageControls.new(this).addElement()
        // 画笔控制器
        let pen = PenControls.new(this).addElement()
        // 配置控制器
        ConfigControls.new(this, pen).addElement()
        // 文字控制器
        TextControls.new(this).addElement()
    }
}