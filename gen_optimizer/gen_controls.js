class GenControls {
    constructor(scene) {
        this.optimizer = scene.optimizer
        this.canvas = this.optimizer.canvas
        this.context = this.optimizer.context
        this.images = this.optimizer.images
        this.scene = scene
    }

    static new(...args) {
        return new this(...args)
    }

    addElement() {
        this.scene.elements.push(this)
        return this
    }

    pointInFrame(x, y) {
        let xIn = x >= this.x && x <= this.x + this.w
        let yIn = y >= this.y && y <= this.y + this.h
        return xIn && yIn
    }
    
    coordinateToCanvas(x, y) {
        let canvasBound = this.canvas.getBoundingClientRect()
        return {
            "x": x - canvasBound.left,
            "y": y - canvasBound.top,
        }
    }

    canvasToCoordinate(x, y) {
        let canvasBound = this.canvas.getBoundingClientRect()
        return {
            "x": x + canvasBound.left,
            "y": y + canvasBound.top,
        }
    }

    pageToCanvas(x, y) {
        let self = this
        return {
            "x": x - self.canvas.offsetLeft,
            "y": y - self.canvas.offsetTop,
        }
    }

    canvasToPage(x, y) {
        let self = this
        return {
            "x": x + self.canvas.offsetLeft,
            "y": y + self.canvas.offsetTop,
        }
    }

    draw() {
    }

    update() {
    }
    
}