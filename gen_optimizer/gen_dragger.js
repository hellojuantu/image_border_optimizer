class GenDragger extends GenControls {
    constructor(scene, centerX, centerY) {
        super(scene)        
        this.w = 10
        this.h = 10
        this.x = centerX - (this.w / 2)
        this.y = centerY - (this.h / 2)
        this.active = false
        this.setupMove()
    }

    setupMove() {
        let self = this
        self.optimizer.resgisterMouse(function(event, action) {
            let x = event.offsetX
            let y = event.offsetY
            let targetDragger = self.pointInFrame(x, y)
            log("dragger", action, targetDragger)
            // if (action == 'down') {
            // } else if (action == 'move' && targetDragger) {
            //     self.canvas.style.cursor = 'e-resize'
            // } else if (action == 'up' && targetDragger) {
            //     self.canvas.style.cursor = ''
            // }
        })
    }

    draw() {
        let ctx = this.context
        ctx.save()
        ctx.fillStyle = 'red'
        // log("dragger", this.x, this.y)
        ctx.fillRect(this.x, this.y, this.w, this.h)
        ctx.restore()
    }
}