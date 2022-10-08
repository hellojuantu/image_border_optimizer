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
        this.numberOfDraggers = 2        
        this.minDistance = 0
    }

    static configAttribute() {
        return {
            "config.shapeBorder": config.shapeBorder,
            "config.shapeColor": config.shapeColor,
        }
    }

    selected() {
        super.selected()
        this.updateControls("config.shapeBorder.value", parseInt(this.border))
        this.updateControls("config.shapeColor.value", this.color)
        return GenArrow.configAttribute()
    }

    calcalateOffset(x, y) {
        this.ox = this.fromX - x
        this.oy = this.fromY - y
        this.ox2 = this.toX - x
        this.oy2 = this.toY - y
    }

    moving(x, y) {
        // 移动 箭头
        this.fromX = x + this.ox
        this.fromY = y + this.oy
        //
        this.toX = x + this.ox2
        this.toY = y + this.oy2
    }

    pointInShapeFrame(x, y) {
        // 判断点是否在有角度的矩形框内
        let v1 = Vector.new(this.fromX, this.fromY)
        let v2 = Vector.new(this.toX, this.toY)
        let v3 = Vector.new(x, y)
        if (v1.distance(v3) + v2.distance(v3) < v1.distance(v2) + this.border / 4) {
            return true
        }
        return false
    }

    creating(x, y) {
        this.toX = x
        this.toY = y
    }

    setupDraggers() {
        // 
        let tailDragger = GenDragger.new(this, 0, 0, 'crosshair', 'tail')
        tailDragger.resetPosition = function() {
            this.x = this.offsetX + this.owner.fromX - this.w / 2
            this.y = this.offsetY + this.owner.fromY - this.h / 2
        }
        this.addDragger(tailDragger)
        //
        let headDragger = GenDragger.new(this, 0, 0, 'crosshair', 'head')
        headDragger.resetPosition = function() {
            this.x = this.offsetX + this.owner.toX - this.w / 2
            this.y = this.offsetY + this.owner.toY - this.h / 2
        }
        this.addDragger(headDragger) 
    }

    movingByDragger(dragger, x, y) {
        if (dragger.name == 'tail') {
            this.fromX = x
            this.fromY = y
        } else if (dragger.name == 'head') {
            this.toX = x
            this.toY = y   
        }
    }
    
    idle() {
        this.setupDraggers()
        
        //
        this.w = this.distance
        this.h = this.border
        this.x = this.fromX - this.border / 2
        this.y = this.fromY - this.border / 2

        super.idle()
    }

    checkStatus() {        
        let v1 = Vector.new(this.fromX, this.fromY)
        let v2 = Vector.new(this.toX, this.toY)
        this.distance = v1.distance(v2)
        log("checkStatus", this.distance)
        log("deleted", this.distance <= this.minDistance)
        if (this.distance <= this.minDistance) {
            super.deleted()
            return 
        }
    }

    update() {
        this.w = this.distance
        this.h = this.border
        this.x = this.fromX - this.border / 2
        this.y = this.fromY - this.border / 2
        this.rotate = 180 / Math.PI * Math.atan2(this.toY - this.fromY, this.toX - this.fromX)
    }
    
    draw() {  
        let ctx = this.context
        let fromX = this.fromX
        let fromY = this.fromY
        let toX = this.toX
        let toY = this.toY
        let theta = 40
        let width = this.border
        let headlen = width * 3
        let color = this.color

        let v1 = Vector.new(this.fromX, this.fromY)
        let v2 = Vector.new(this.toX, this.toY)
        this.distance = v1.distance(v2)
        
        if (this.distance <= 0) {
            // super.deleted()
            return
        }

        // 计算各角度和对应的 P2, P3 坐标
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
        if (this.distance >= this.minDistance) {
            ctx.moveTo(arrowX, arrowY)
            ctx.lineTo(toX, toY)
        }
        arrowX = toX + botX
        arrowY = toY + botY
        if (this.distance >= this.minDistance) {
            ctx.lineTo(arrowX, arrowY)
        }
        ctx.strokeStyle = color
        ctx.lineWidth = width
        ctx.stroke()
        ctx.restore()

        super.draw()
    }
}