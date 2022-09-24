class GenRect extends GenShape {
    constructor(scene, x, y, w, h) {
        super(scene)
        this.x = x
        this.y = y
        this.w = w || 0
        this.h = h || 0
        this.border = config.shapeBorder.value
        this.color = config.shapeColor.value    
        this.status = this.enumStatus.creating
        this.numberOfDraggers = 4
    }

    creating(x, y) {
        super.creating()
        this.w = x - this.x
        this.h = y - this.y
    }

    checkStatus() {        
        // 无效图形直接删除
        if (this.w == 0 || this.h == 0) {
            super.deleted()
            return
        }
    }

    makeSpecial() {
        this.w = this.h
    }

    idle() {   
        if (this.w < 0 || this.h < 0) {
            let offsetX = this.w < 0 ? this.w : 0
            let offsetY = this.h < 0 ? this.h : 0
            this.x = this.x + offsetX
            this.y = this.y + offsetY
            this.w = Math.abs(this.w)
            this.h = Math.abs(this.h)
        }      

        // 先检查状态, 后序还会检查
        this.checkStatus()

        this.addDragger(GenDragger.new(this, 0, 0, 0 ,'nw-resize'))
        this.addDragger(GenDragger.new(this, this.w, 0, 0, 'ne-resize'))
        this.addDragger(GenDragger.new(this, this.w, this.h, 0, 'se-resize'))
        this.addDragger(GenDragger.new(this, 0, this.h, 0, 'sw-resize'))
        
        // 创建成功, 处于闲置状态
        super.idle()
    }

    pointInShapeFrame(x, y) {
        return this.pointInHollowFrame(x, y, this.border)
    }

    draw() {
        this.context.save()
        this.context.lineWidth = this.border
        this.context.strokeStyle = this.color
        this.context.beginPath()
        this.context.moveTo(this.x, this.y)
        this.context.lineTo(this.x, this.y + this.h)
        this.context.lineTo(this.x + this.w, this.y + this.h)
        this.context.lineTo(this.x + this.w, this.y)
        this.context.lineTo(this.x, this.y)
        this.context.closePath()
        this.context.stroke()
        this.context.restore()      
        // 绘制拖拽点
        super.draw() 
    }
}