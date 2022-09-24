class GenDragger extends GenShape {
    // dragger 的坐标是相对于 ownerShape x, y 
    constructor(ownerShape, offsetX, offsetY, rotate=0, cursor='move') {
        super(ownerShape.scene)        
        this.owner = ownerShape
        this.w = 10
        this.h = 10
        this.offsetX = offsetX
        this.offsetY = offsetY
        this.x = offsetX
        this.y = offsetY
        this.active = false
        this.rotate = rotate
        this.cursor = cursor
        this.status = this.enumStatus.idle
    }

    calcalateOffset(x, y) {
        return this.owner.calcalateOffset(x, y)
    }

    activateDraggers() {
        this.owner.activateDraggers()
    }

    moving(x, y, ox, oy) {
        if (this.owner.isSelected()) {
            return
        }
        this.owner.moving(x, y, ox, oy)
    }

    setPosition(x, y) {
        let drag = this
        drag.x = drag.offsetX + x - this.w / 2
        drag.y = drag.offsetY + y - this.h / 2
    }

    draw() {
        let ctx = this.context
        var w2 = this.w / 2
        var h2 = this.h / 2
        ctx.save()
        //
        ctx.fillStyle = 'red'
        ctx.translate(this.x + w2, this.y + h2)
        ctx.rotate(this.rotate * Math.PI / 180)
        ctx.translate(-w2 - this.x, -h2 - this.y)
        ctx.fillRect(this.x, this.y, this.w, this.h)
        ctx.restore()
    }
}