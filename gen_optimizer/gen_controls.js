class GenControls {
    constructor(scene) {
        this.optimizer = scene.optimizer
        this.canvas = this.optimizer.canvas
        this.context = this.optimizer.context
        this.images = this.optimizer.images
        this.scene = scene
    }

    static new (...args) {
        return new this(...args)
    }

    addEvent(eventName, callback) {
        this.scene.events[eventName] = callback
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
    
    draw() {
    }

    update() {
    }
    
}