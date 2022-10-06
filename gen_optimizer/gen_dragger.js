class GenDragger extends GenShape {
    // dragger 的坐标是相对于 ownerShape x, y 
    constructor(ownerShape, offsetX, offsetY, cursor='crosshair', name) {
        super(ownerShape.scene)        
        this.owner = ownerShape
        this.w = 12
        this.h = 12
        this.offsetX = offsetX
        this.offsetY = offsetY
        this.x = offsetX
        this.y = offsetY
        this.active = false
        this.cursor = cursor
        this.status = this.enumStatus.idle
        this.name = name
    }

    calcalateOffset(x, y) {
        return this.owner.calcalateOffset(x, y)
    }

    activateDraggers() {
        this.owner.activateDraggers()
    }

    selected() {
        this.status = this.enumStatus.selected
        return this.owner.selected()
    }

    moving(x, y) {
        if (this.optimizer.getCursor() == 'move') {
            this.owner.moving(x, y)
        } else if (this.optimizer.getCursor() == this.cursor) {
            this.owner.movingByDragger(this, x, y)
        }
    }

    resetPosition() {
        let drag = this
        drag.x = drag.offsetX + this.owner.x - this.w / 2
        drag.y = drag.offsetY + this.owner.y - this.h / 2
    }

    pointInShapeFrame(x, y) {
        // x, y 在圆中
        let r = this.r
        // 中心坐标
        let x1 = this.x + this.w / 2
        let y1 = this.y + this.h / 2
        // 点到中心坐标的距离
        let d = Math.sqrt((x - x1) * (x - x1) + (y - y1) * (y - y1))
        return d < r
    }

    draw() {
        this.resetPosition()
        //
        let ctx = this.context
        let w2 = this.w / 2
        let h2 = this.h / 2
        ctx.save()
        ctx.beginPath()
        this.r = 6
        ctx.arc(this.x + w2, this.y + h2, this.r, 0, 2 * Math.PI)
        ctx.fillStyle = '#3872c5'
        ctx.lineWidth = 2
        ctx.strokeStyle= 'white'
        // ctx.closePath()
        ctx.fill()
        ctx.stroke()
        ctx.restore()
    }
}