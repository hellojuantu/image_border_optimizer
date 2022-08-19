class GenPen {
    constructor(optimizer) {
        this.optimizer = optimizer
        this.canvas = optimizer.canvas
        this.context = optimizer.context
        this.images = optimizer.images
        this.setup()
    }

    static new (...args) {
        return new this(...args)
    }

    setup() {
        let self = this;
        let ox = 0
        let oy = 0
        this.optimizer.resgisterMouse(function(event, action) {
            log("action", action)
            let canvas = self.canvas
            let context = self.context
            let x = event.offsetX
            let y = event.offsetY
            var box = canvas.getBoundingClientRect()
            context.save()
            if (action == 'down') {
                ox = x * (canvas.width / box.width)
                oy = y * (canvas.height / box.height)
                context.beginPath()
                context.moveTo(ox, oy)
                log('ox, oy', ox, oy)
            } else if (action == 'move') {
                ox = x * (canvas.width / box.width)
                oy = y * (canvas.height / box.height)
                log('ox, oy', ox, oy)
                context.strokeStyle = config.penColor.value
                context.lineWidth = config.penWeight.value
                context.lineTo(ox, oy)
                context.stroke()
            } else if (action == 'up') {
                context.closePath()
            }
        })
    }


}