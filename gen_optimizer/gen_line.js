class GenLine extends GenArrow {
    constructor(scene, fromX, fromY, toX, toY) {
        super(scene, fromX, fromY, toX, toY)
        this.isLine = true       
    }
    
    draw() {  
        let ctx = this.context
        let fromX = this.fromX
        let fromY = this.fromY
        let toX = this.toX
        let toY = this.toY
        let width = this.border
        let color = this.color

        let v1 = Vector.new(this.fromX, this.fromY)
        let v2 = Vector.new(this.toX, this.toY)
        this.distance = v1.distance(v2)
        
        if (this.distance <= 0) {
            // super.deleted()
            return
        }
     
        ctx.save()
        ctx.beginPath()
        ctx.moveTo(fromX, fromY)
        ctx.lineTo(toX, toY)
        ctx.strokeStyle = color
        ctx.lineWidth = width
        ctx.stroke()
        ctx.restore()

        super.drawDraggers()
    }
}