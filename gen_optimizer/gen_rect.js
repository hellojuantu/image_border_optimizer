class GenRect extends GenShape {
    constructor(scene, x, y, w, h) {
        super(scene)
        this.x = x
        this.y = y
        this.w = w || 0
        this.h = h || 0
        this.border = config.shapeBorder.value
        this.color = config.shapeColor.value    
        this.draggers = []
        this.draggers.push(GenDragger.new(this.scene, this.x, this.y))
    }
    
    static new(...args) {
        return new this(...args)
    }

    setMoving(x, y) {
        this.w = x - this.x
        this.h = y - this.y
    }

    checkAndClear() {
        if (this.w == 0 || this.h == 0) {
            this.deleted = true
        }
        if (this.w < 0 || this.h < 0) {
            let offsetX = this.w < 0 ? this.w : 0
            let offsetY = this.h < 0 ? this.h : 0
            this.x = this.x + offsetX
            this.y = this.y + offsetY
            this.w = Math.abs(this.w)
            this.h = Math.abs(this.h)
        }        
    }

    setupClick() {
        
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
        for (let drag of this.draggers.filter(d => d.active)) {
            drag.draw()
        }
    }
}