class GenCircle extends GenShape {
    constructor(scene, x, y) {
        super(scene)
        this.border = config.shapeBorder.value
        this.color = config.shapeColor.value    
        this.fill = parseBoolean(config.shapeFill.value)
        this.status = this.enumStatus.creating
        this.numberOfDraggers = 4
        // 四个定点坐标
        this.position = {
            'leftTop': Vector.new(x, y),
            'leftBottom': Vector.new(x, y),
            'rightTop': Vector.new(x, y),
            'rightBottom': Vector.new(x, y),
        }
    }

    static configAttribute() {
        return {
            "config.shapeBorder": config.shapeBorder,
            "config.shapeColor": config.shapeColor,
            "config.shapeFill": config.shapeFill,
        }
    }

    selected() {
        super.selected()
        this.updateControls("config.shapeBorder.value", parseInt(this.border))
        this.updateControls("config.shapeColor.value", this.color)
        this.updateControls("config.shapeFill.value", this.fill)
        return GenCircle.configAttribute()
    }

    moving(x, y) {
        for (let p of Object.keys(this.position)) {
            let v = this.position[p]
            v.x = x + this.positionOffset[p].x
            v.y = y + this.positionOffset[p].y
        }
    }

    calcalateOffset(x, y) {
        let self = this
        this.positionOffset = {
            'leftTop': Vector.new(self.position.leftTop.x - x, self.position.leftTop.y - y),
            'leftBottom': Vector.new(self.position.leftBottom.x - x, self.position.leftBottom.y - y),
            'rightTop': Vector.new(self.position.rightTop.x - x, self.position.rightTop.y - y),
            'rightBottom': Vector.new(self.position.rightBottom.x - x, self.position.rightBottom.y - y),
        }
    }

    checkStatus() {                
        let w = Math.abs(this.position.rightBottom.x - this.position.leftTop.x)
        let h = Math.abs(this.position.rightBottom.y - this.position.leftTop.y) 
        let border = this.border || null
        // log("check status", w, h, border)
        // 无效图形直接删除
        if (w <= 0 || h <= 0 || border == null) {
            log("rect delete")
            super.deleted()
            return
        }
        // log("rect create")
    }

    creating(x, y) {
        super.creating()
        this.position.rightBottom.x = x
        this.position.rightBottom.y = y
        this.position.rightTop.x = x
        this.position.leftBottom.y = y
    }

    setupDraggers() {
        let leftTop = GenDragger.new(this, 0, 0, 'crosshair', 'leftTop')
        leftTop.resetPosition = function() {
            this.x = this.offsetX + this.owner.position.leftTop.x - this.w / 2
            this.y = this.offsetY + this.owner.position.leftTop.y - this.h / 2
        }
        this.addDragger(leftTop)

        let rightTop = GenDragger.new(this, 0, 0, 'crosshair', 'rightTop')
        rightTop.resetPosition = function() {
            this.x = this.offsetX + this.owner.position.rightTop.x - this.w / 2
            this.y = this.offsetY + this.owner.position.rightTop.y - this.h / 2
        }
        this.addDragger(rightTop)

        let leftBottom = GenDragger.new(this, 0, 0, 'crosshair', 'leftBottom')
        leftBottom.resetPosition = function() {
            this.x = this.offsetX + this.owner.position.leftBottom.x - this.w / 2
            this.y = this.offsetY + this.owner.position.leftBottom.y - this.h / 2
        }
        this.addDragger(leftBottom)

        let rightBottom = GenDragger.new(this, 0, 0, 'crosshair', 'rightBottom')
        rightBottom.resetPosition = function() {
            this.x = this.offsetX + this.owner.position.rightBottom.x - this.w / 2
            this.y = this.offsetY + this.owner.position.rightBottom.y - this.h / 2
        }
        this.addDragger(rightBottom)
    }

    movingByDragger(dragger, x, y) {
        let v = this.position[dragger.name]
        v.x = x
        v.y = y
        if (dragger.name == 'leftTop') {            
            this.position.rightTop.y = y 
            this.position.leftBottom.x = x
        } else if (dragger.name == 'rightTop') {
            this.position.leftTop.y = y 
            this.position.rightBottom.x = x
        } else if (dragger.name == 'rightBottom') {
            this.position.leftBottom.y = y
            this.position.rightTop.x = x 
        } else if (dragger.name == 'leftBottom') {
            this.position.rightBottom.y = y
            this.position.leftTop.x = x
        }
    }

    pointInShapeFrame(px, py) {
        if (this.isCreating()) {
            return true
        }
        let pointInRectDraggerLine = false
        if (this.isSelected()) {
            pointInRectDraggerLine = super.pointInHollowFrame(px, py, 1.5)
        }
        if (this.fill) {
            return this.pointInFrame(px, py) || pointInRectDraggerLine
        }
        return this.pointInHollowFrame(px, py, this.border) || pointInRectDraggerLine
    }

    pointInFrame(px, py) {
        let center = this.center()
        let xRadius = this.w / 2
        let yRadius = this.h / 2
        if (xRadius <= 0 || yRadius <= 0) {
            return false
        }
        let normalized = Vector.new(px - center.x, py - center.y)
        return Math.pow(normalized.x / xRadius, 2) + Math.pow(normalized.y / yRadius, 2) <= 1
    }

    pointInHollowFrame(px, py, border) {
        let center = this.center()
        let xRadius = (this.w - this.border) / 2
        let yRadius = (this.h - this.border) / 2
        if (xRadius <= 0 || yRadius <= 0) {
            return false
        }
        let normalized = Vector.new(px - center.x, py - center.y)
        let halfBorder = border / 2
        let inner = Math.pow(normalized.x / (xRadius + halfBorder), 2) + Math.pow(normalized.y / (yRadius + halfBorder), 2) <= 1
        // 去除椭圆边框
        let outer = Math.pow(normalized.x / (xRadius - halfBorder), 2) + Math.pow(normalized.y / (yRadius - halfBorder), 2) >= 1
        return inner && outer
    }

    leftTopPosition() {
        // 遍历寻找 x 相加 y 最小的点, 就是 leftTop
        let leftTop = this.position.leftTop
        for (let p of Object.keys(this.position)) {
            let v = this.position[p]
            if (v.x + v.y < leftTop.x + leftTop.y) {
                leftTop = v
            }
        }
        return leftTop
    }

    connectDraggers() {
        // 连接四个拖拽点
        let leftTop = this.position.leftTop
        let rightTop = this.position.rightTop
        let leftBottom = this.position.leftBottom
        let rightBottom = this.position.rightBottom
        this.context.moveTo(leftTop.x, leftTop.y)
        this.context.lineTo(rightTop.x, rightTop.y)
        this.context.lineTo(rightBottom.x, rightBottom.y)
        this.context.lineTo(leftBottom.x, leftBottom.y)
        this.context.lineTo(leftTop.x, leftTop.y)     
    }

    update() {
        this.x = this.leftTopPosition().x
        this.y = this.leftTopPosition().y
        this.w = Math.abs(this.position.rightBottom.x - this.position.leftTop.x)
        this.h = Math.abs(this.position.rightBottom.y - this.position.leftTop.y) 
    }

    draw() {
        if (this.w > 0 && this.h > 0) {
            this.context.save()
            this.context.strokeStyle = this.color
            this.context.beginPath()
            let w2 = this.w / 2
            let h2 = this.h / 2
            if (this.fill) {
                this.context.fillStyle = this.color
                this.context.ellipse(this.ratio * (this.x + w2), this.ratio * (this.y + h2), w2 * this.ratio, h2 * this.ratio, 0, 0, 2 * Math.PI)
                this.context.fill()
            } else {                
                if (this.w > 2 * this.border && this.h > 2 * this.border) {
                    let halfBorder = this.border / (2 * this.ratio)
                    this.context.lineWidth = this.border
                    this.context.ellipse(this.ratio * (this.x + w2), this.ratio * (this.y + h2), (w2 - halfBorder * 2) * this.ratio, (h2 - halfBorder * 2) * this.ratio, 0, 0, Math.PI * 2)
                    this.context.stroke()
                } else {                
                    this.context.fillStyle = this.color
                    this.context.ellipse(this.ratio * (this.x + w2), this.ratio * (this.y + h2), w2 * this.ratio, h2 * this.ratio, 0, 0, 2 * Math.PI)
                    this.context.fill()
                }
            }
            this.context.closePath()
            this.context.restore()
            // 绘制拖拽点
            super.draw()             
        }
    }
}