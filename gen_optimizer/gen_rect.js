class GenRect extends GenShape {
    constructor(scene, x, y) {
        super(scene)
        this.border = config.shapeBorder.value
        this.color = config.shapeColor.value    
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
        }
    }

    selected() {
        super.selected()
        this.updateControls("config.shapeBorder.value", parseInt(this.border))
        this.updateControls("config.shapeColor.value", this.color)
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
        let border = this.border || null
        // 无效图形直接删除
        if (this.w <= 0 || this.h <= 0 || border == null) {
            super.deleted()
            return
        }
    }

    creating(x, y) {
        super.creating()
        this.position.rightBottom.x = x
        this.position.rightBottom.y = y
        this.position.rightTop.x = x
        this.position.leftBottom.y = y
    }

    makeSpecial() {
        this.w = this.h
    }

    setupDraggers() {
        let leftTop = GenDragger.new(this, 0, 0, 'crosshair', 'left-top')
        leftTop.resetPosition = function() {
            this.x = this.offsetX + this.owner.position.leftTop.x - this.w / 2
            this.y = this.offsetY + this.owner.position.leftTop.y - this.h / 2
        }
        this.addDragger(leftTop)

        let rightTop = GenDragger.new(this, 0, 0, 'crosshair', 'right-top')
        rightTop.resetPosition = function() {
            this.x = this.offsetX + this.owner.position.rightTop.x - this.w / 2
            this.y = this.offsetY + this.owner.position.rightTop.y - this.h / 2
        }
        this.addDragger(rightTop)

        let rightBottom = GenDragger.new(this, 0, 0, 'crosshair', 'right-bottom')
        rightBottom.resetPosition = function() {
            this.x = this.offsetX + this.owner.position.rightBottom.x - this.w / 2
            this.y = this.offsetY + this.owner.position.rightBottom.y - this.h / 2
        }
        this.addDragger(rightBottom)

        let leftBottom = GenDragger.new(this, 0, 0, 'crosshair', 'left-bottom')
        leftBottom.resetPosition = function() {
            this.x = this.offsetX + this.owner.position.leftBottom.x - this.w / 2
            this.y = this.offsetY + this.owner.position.leftBottom.y - this.h / 2
        }
        this.addDragger(leftBottom)
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

    pointInShapeFrame(x, y) {
        return this.pointInHollowFrame(x, y, this.border)
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
    }

    draw() {
        if (this.w > 0 && this.h > 0) {
            this.context.save()
            this.context.lineWidth = this.border
            this.context.strokeStyle = this.color
            this.context.beginPath()
            this.context.moveTo(this.position.leftTop.x, this.position.leftTop.y)
            this.context.lineTo(this.position.rightTop.x, this.position.rightTop.y)
            this.context.lineTo(this.position.rightBottom.x, this.position.rightBottom.y)
            this.context.lineTo(this.position.leftBottom.x, this.position.leftBottom.y)
            this.context.closePath()
            this.context.stroke()
            this.context.restore()  
            // 绘制拖拽点
            super.draw() 
        } else {
            // this.deleted()
        }
    }
}