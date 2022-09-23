class GenDragger extends GenShape {
    // dragger 的坐标是相对于 shape x, y 
    constructor(scene, offsetX, offsetY, rotate=0, cursor='move') {
        super(scene)        
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
        // this.cursorEnum = {
        //     northWest: 'nw-resize',
        //     northEast: 'ne-resize',
        //     southWest: 'sw-resize',
        //     southEast: 'se-resize',
        // }
        this.setupMove()
    }

    setupMove() {
        let self = this
        // self.optimizer.resgisterMouse(function(event, action) {
        //     let x = event.offsetX
        //     let y = event.offsetY
        //     let dragger = self.pointInFrame(x, y)
        //     // log("drag", dragger)
        //     if (action == 'overmove') {
        //         if (dragger != null) {
        //             // log("overmove", dragger)
        //             self.optimizer.setCursor(dragger.cursor)
        //         }
        //     }
        // })
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