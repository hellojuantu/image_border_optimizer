class GenDragger extends GenShape {
    // dragger 的坐标是相对于 ownerShape x, y 
    constructor(ownerShape, offsetX, offsetY, cursor='crosshair', positionDesc) {
        super(ownerShape.scene)        
        this.owner = ownerShape
        this.w = 10
        this.h = 10
        this.offsetX = offsetX
        this.offsetY = offsetY
        this.x = offsetX
        this.y = offsetY
        this.active = false
        this.cursor = cursor
        this.status = this.enumStatus.idle
        this.positionDesc = positionDesc
    }

    calcalateOffset(x, y) {
        return this.owner.calcalateOffset(x, y)
    }

    activateDraggers() {
        this.owner.activateDraggers()
    }

    moving(x, y) {
        log("this.optimizer.getCursor()", this.optimizer.getCursor())
        if (this.optimizer.getCursor() == 'move') {
            this.owner.moving(x, y)
            return
        }
        this.owner.movingByDragger(this, x, y)
    }

    resetPosition() {
        let drag = this
        drag.x = drag.offsetX + this.owner.x - this.w / 2
        drag.y = drag.offsetY + this.owner.y - this.h / 2
    }

    draw() {
        this.resetPosition()
        //
        let ctx = this.context
        var w2 = this.w / 2
        var h2 = this.h / 2
        ctx.save()
        ctx.beginPath()
        let r = 6
        ctx.arc(this.x + w2, this.y + h2, r, 0, 2 * Math.PI)
        ctx.fillStyle = '#3872c5'
        ctx.lineWidth = 2
        ctx.strokeStyle= 'white'
        // ctx.closePath()
        ctx.fill()
        ctx.stroke()
        ctx.restore()
    }
}