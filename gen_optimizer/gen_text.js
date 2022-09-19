class GenText extends GenControls {
    constructor(scene, text, x, y) {
        super(scene)
        this.text = text
        this.dragged = false
        this.x = x
        this.y = y
        this.font = config.textFont.value
        this.color = config.textFontColor.value
    }
    
    static new (...args) {
        return new this(...args)
    }

    draw() {
        // log("draw text", this.text, this)
        this.context.save()
        this.context.textBaseline = "top"
        this.context.font = this.font
        let metrics = this.context.measureText(this.text)
        this.w = metrics.width
        this.h = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
        this.context.fillStyle = this.color
        this.context.fillText(this.text, this.x, this.y)        
        this.context.restore()
    }

}