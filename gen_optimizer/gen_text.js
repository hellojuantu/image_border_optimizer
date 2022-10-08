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
        this.position = {
            'leftTop': Vector.new(this.x, this.y),
            'leftBottom': Vector.new(this.x, this.y + this.h),
            'rightTop': Vector.new(this.x + this.w, this.y),
            'rightBottom': Vector.new(this.x + this.w, this.y + this.h),
        }
        let leftTop = this.position.leftTop
        let rightTop = this.position.rightTop
        let leftBottom = this.position.leftBottom
        let rightBottom = this.position.rightBottom
        this.context.moveTo(leftTop.x, leftTop.y)
        this.context.lineTo(rightTop.x, rightTop.y)
        this.context.lineTo(rightBottom.x, rightBottom.y)
        this.context.lineTo(leftBottom.x, leftBottom.y)
        this.context.lineTo(leftTop.x, leftTop.y)   
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