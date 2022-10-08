class GenText extends GenShape {
    constructor(scene, text, x, y) {
        super(scene)
        this.text = text
        this.x = x
        this.y = y
        this.font = config.textFont.value
        this.color = config.textColor.value
        this.status = this.enumStatus.creating
        this.isText = true
    }
    
    static configAttribute() {
        return {
            "config.textFont": config.textFont,
            "config.textColor": config.textColor,
        }
    }

    selected() {
        super.selected()
        this.updateControls("config.textFont.value", this.font)
        this.updateControls("config.textColor.value", this.color)
        return GenText.configAttribute()
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

    pointInShapeFrame(x, y) {
        return this.pointInFrame(x, y)
    }

    connectDraggers() {
        // 连接四个拖拽点
        this.context.save()
        this.context.strokeStyle = '#29a1ff'
        this.context.strokeRect(this.x, this.y, this.w, this.h)
        this.context.restore()   
    }
    
    draw() {
        // log("draw text", this.text, this)       
        this.context.save()
        this.context.textBaseline = "top"
        this.context.font = this.font
        let metrics = this.context.measureText(this.text)
        this.w = metrics.width
        this.h = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent

        this.context.fillStyle = this.color
        this.context.textBaseline = "middle"
        this.context.fillText(this.text, this.x, this.y + this.h / 2)      
        this.context.restore()
        
        super.draw()
       
    }
}