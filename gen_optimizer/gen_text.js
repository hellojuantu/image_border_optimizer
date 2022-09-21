class GenText extends GenControls {
    constructor(scene, text, x, y) {
        super(scene)
        this.text = text
        this.dragged = false
        this.id = uuid()
        this.x = x
        this.y = y
        this.font = config.textFont.value
        this.color = config.textFontColor.value
        this.deleted = false
    }
    
    static new (...args) {
        return new this(...args)
    }

    fillProp(prop) {
        for (let p of Object.keys(prop)) {
            this[p] = prop[p]
        }
        return this
    }

    draw() {
        // log("draw text", this.text, this)
        if (this.deleted) {
            return
        }
        this.context.save()
        this.context.textBaseline = "top"
        this.context.font = this.font
        let metrics = this.context.measureText(this.text)
        this.w = metrics.width
        this.h = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent

        this.context.fillStyle = this.color
        this.context.fillText(this.text, this.x, this.y)        
        this.context.restore()
    }
}