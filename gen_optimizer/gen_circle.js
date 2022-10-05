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
        return GenRect.configAttribute()
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
            log("******** circle delete")
            super.deleted()
            return
        }
        // log("************** circle create")
    }

    creating(x, y) {
        super.creating()
        this.position.rightBottom.x = x
        this.position.rightBottom.y = y
        this.position.rightTop.x = x
        this.position.leftBottom.y = y
    }

    setupDraggers() {
        let leftTop = GenDragger.new(this, 0, 0, 'crosshair', 'left-top')
        leftTop.resetPosition = function() {
            let direct = this.owner.directMatrix['leftTop']
            this.x = this.offsetX + this.owner.position.leftTop.x - this.w / 2 + direct[0] * this.owner.border / 2
            this.y = this.offsetY + this.owner.position.leftTop.y - this.h / 2 + direct[1] * this.owner.border / 2
        }
        this.addDragger(leftTop)

        let rightTop = GenDragger.new(this, 0, 0, 'crosshair', 'right-top')
        rightTop.resetPosition = function() {
            let direct = this.owner.directMatrix['rightTop']
            this.x = this.offsetX + this.owner.position.rightTop.x - this.w / 2 + direct[0] * this.owner.border / 2
            this.y = this.offsetY + this.owner.position.rightTop.y - this.h / 2 + direct[1] * this.owner.border / 2
        }
        this.addDragger(rightTop)

        let leftBottom = GenDragger.new(this, 0, 0, 'crosshair', 'left-bottom')
        leftBottom.resetPosition = function() {
            let direct = this.owner.directMatrix['leftBottom']
            this.x = this.offsetX + this.owner.position.leftBottom.x - this.w / 2 + direct[0] * this.owner.border / 2
            this.y = this.offsetY + this.owner.position.leftBottom.y - this.h / 2 + direct[1] * this.owner.border / 2
        }
        this.addDragger(leftBottom)

        let rightBottom = GenDragger.new(this, 0, 0, 'crosshair', 'right-bottom')
        rightBottom.resetPosition = function() {
            let direct = this.owner.directMatrix['rightBottom']
            this.x = this.offsetX + this.owner.position.rightBottom.x - this.w / 2 + direct[0] * this.owner.border / 2
            this.y = this.offsetY + this.owner.position.rightBottom.y - this.h / 2 + direct[1] * this.owner.border / 2
        }
        this.addDragger(rightBottom)
    }

    movingByDragger(dragger, x, y) {
        if (dragger.positionDesc == 'left-top') {
            log("left top")            
            this.position.leftTop.x = x
            this.position.leftTop.y = y
            this.position.rightTop.y = y
            this.position.leftBottom.x = x
        } else if (dragger.positionDesc == 'right-top') {
            log("right top")
            this.position.rightTop.x = x
            this.position.rightTop.y = y
            this.position.leftTop.y = y
            this.position.rightBottom.x = x
        } else if (dragger.positionDesc == 'right-bottom') {
            log('right-bottom')
            this.position.rightBottom.x = x
            this.position.rightBottom.y = y
            this.position.leftBottom.y = y
            this.position.rightTop.x = x
        } else if (dragger.positionDesc == 'left-bottom') {
            log("left-bottom")
            this.position.leftBottom.x = x
            this.position.leftBottom.y = y
            this.position.leftTop.x = x
            this.position.rightBottom.y = y
        }
    }

    pointInShapeFrame(px, py) {
        if (this.isCreating()) {
            return true
        }
        if (this.fill) {
            return this.pointInFrame(px, py)
        }
        return this.pointInHollowFrame(px, py, this.border)
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
        let xRadius = this.w / 2
        let yRadius = this.h / 2
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

    update() {
        this.x = this.leftTopPosition().x
        this.y = this.leftTopPosition().y
        this.w = Math.abs(this.position.rightBottom.x - this.position.leftTop.x)
        this.h = Math.abs(this.position.rightBottom.y - this.position.leftTop.y) 
        this.updateDirectMatrix()
    }

    /**
     * 更新方向矩阵, 给 border 加减使用
     */
    updateDirectMatrix() {
        if (this.fill) {
            this.directMatrix = {
                'leftTop': [0, 0],
                'leftBottom': [0, 0],
                'rightTop': [0, 0],
                'rightBottom': [0, 0],
            }
            return
        }
        this.directMatrix = {
            'leftTop': [-1, -1],
            'leftBottom': [-1, 1],
            'rightTop': [1, -1],
            'rightBottom': [1, 1],
        }
        // 复制 this.position
        let position = {}
        for (let p of Object.keys(this.position)) {
            position[p] = this.position[p]
        }
        // 计算方向矩阵
        for (let p of Object.keys(position)) {
            let v = position[p]
            let direct = this.directMatrix[p]
            let x = v.x - this.x
            let y = v.y - this.y
            if (x == 0) {
                direct[0] = -1
            } else {
                direct[0] = x / Math.abs(x)
            }
            if (y == 0) {
                direct[1] = -1
            } else {
                direct[1] = y / Math.abs(y)
            }
        }
    }

    draw() {
        if (this.w > 0 && this.h > 0) {
            this.context.save()
            this.context.strokeStyle = this.color
            this.context.beginPath()
            let w2 = this.w / 2
            let h2 = this.h / 2
            this.context.ellipse(this.x + w2, this.y + h2, w2, h2, 0, 0, Math.PI * 2)
            if (this.fill) {
                this.context.fillStyle = this.color
                this.context.fill()            
            } else {
                this.context.lineWidth = this.border
            }
            this.context.closePath()
            this.context.stroke()
            this.context.restore()    
            // 绘制拖拽点
            super.draw() 
        }
    }
}