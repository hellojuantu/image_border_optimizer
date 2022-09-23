class GenArrow extends GenShape {
    constructor(scene, fromX, fromY, toX, toY) {
        super(scene)
        this.fromX = fromX
        this.fromY = fromY
        this.toX = toX || this.fromX
        this.toY = toY || this.fromY
        this.rotate = 0
        this.color = config.shapeColor.value
        this.border = config.shapeBorder.value
        this.status = this.enumStatus.creating
        this.draggers = []
    }

    pointInShapeFrame(x, y, rotate) {
        // x,y 在矩形中
        
        
    }

    idle() {
        if (this.fromX == this.toX || this.fromY == this.toY) {
            this.deleted()
        }

        this.rotate = 180 / Math.PI * Math.atan2(this.toY - this.fromY, this.toX - this.fromX)
        // log("rotate", rotate)
        this.draggers.push(GenDragger.new(this.scene, 0, 0, this.rotate))
        this.draggers.push(GenDragger.new(this.scene, this.toX - this.fromX, this.toY - this.fromY, this.rotate))

        super.idle()
    }

    creating(x, y) {
        this.toX = x
        this.toY = y
    }

    draw() { 
        let ctx = this.context
        let fromX = this.fromX
        let fromY = this.fromY
        let toX = this.toX
        let toY = this.toY
        let theta = 40
        let width = Math.max(this.border, 5)
        let headlen = width * 3
        let color = this.color
     
        // 计算各角度和对应的P2,P3坐标
        let angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
            angle1 = (angle + theta) * Math.PI / 180,
            angle2 = (angle - theta) * Math.PI / 180,
            topX = headlen * Math.cos(angle1),
            topY = headlen * Math.sin(angle1),
            botX = headlen * Math.cos(angle2),
            botY = headlen * Math.sin(angle2)
     
        ctx.save()
        ctx.beginPath()
     
        let arrowX = fromX - topX,
            arrowY = fromY - topY
     
        ctx.moveTo(arrowX, arrowY)
        ctx.moveTo(fromX, fromY)
        ctx.lineTo(toX, toY)
        arrowX = toX + topX
        arrowY = toY + topY
        ctx.moveTo(arrowX, arrowY)
        ctx.lineTo(toX, toY)
        arrowX = toX + botX
        arrowY = toY + botY
        ctx.lineTo(arrowX, arrowY)
        ctx.strokeStyle = color
        ctx.lineWidth = width
        ctx.stroke()
        ctx.restore()


        log("draggers", this.draggers)
        for (let drag of this.draggers.filter(d => d.active)) {    
            // drag 需要跟随 rect 移动        
            drag.setPosition(this.fromX, this.fromY)
            drag.draw()
        }
    }
}