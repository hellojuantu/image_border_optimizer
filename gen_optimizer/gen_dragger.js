class GenDragger extends GenControls {
    // dragger 的坐标是相对于 shape x, y 
    constructor(scene, offsetX, offsetY, rotate=0) {
        super(scene)        
        this.w = 10
        this.h = 10
        this.offsetX = offsetX
        this.offsetY = offsetY
        this.x = offsetX
        this.y = offsetY
        this.active = false
        this.rotate = rotate
        this.setupMove()
    }

    setPosition(x, y) {
        let drag = this
        drag.x = drag.offsetX + x - this.w / 2
        drag.y = drag.offsetY + y - this.h / 2
    }

    setupMove() {
        let self = this
        // self.optimizer.resgisterMouse(function(event, action) {
        //     let x = event.offsetX
        //     let y = event.offsetY
        //     let targetDragger = self.pointInFrame(x, y)
        //     log("dragger", action, targetDragger)
        //     // if (action == 'down') {
        //     // } else if (action == 'move' && targetDragger) {
        //     //     self.canvas.style.cursor = 'e-resize'
        //     // } else if (action == 'up' && targetDragger) {
        //     //     self.canvas.style.cursor = ''
        //     // }
        // })
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