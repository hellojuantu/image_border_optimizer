class GenImage extends GenShape {
    constructor(scene, x, y, image) {
        super(scene)
        this.image = image
        this.w = image.width
        this.h = image.height
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
        return GenImage.configAttribute()
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

    pointInShapeFrame(x, y) {
        return this.pointInFrame(x, y)
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
    
    draw() {
        this.context.save()
        // 缩放图片
        this.context.drawImage(this.image, this.x * 2, this.y * 2, this.w * 2, this.h * 2)
        this.drawBorder()
        this.context.restore()
        // 绘制拖拽点
        super.draw() 
    }

    drawBorder() {
        log("border", this.border)
        if (this.border == 0) {
            return
        }
        this.context.save()
        if (this.w > 2 * this.border && this.h > 2 * this.border) {
            this.context.strokeStyle = this.color
            let border = this.border / 2
            this.context.lineWidth = border * 2 * this.ratio
            this.context.strokeRect(this.x + border, this.y + border, this.w - this.border, this.h - this.border)
        } else {
            this.context.fillStyle = this.color
            this.context.fillRect(this.x, this.y, this.w, this.h)               
        }
        this.context.restore()
    }
}