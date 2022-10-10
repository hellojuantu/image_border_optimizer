class GenText extends GenShape {
    constructor(scene, text, x, y) {
        super(scene)
        this.text = text
        this.x = x
        this.y = y
        this.font = config.textFont.value
        this.color = config.textColor.value
        this.status = this.enumStatus.creating
        this.isText = true
        this.numberOfDraggers = 2
    }
    
    static configAttribute() {
        return {
            "config.textFont": config.textFont,
            "config.textColor": config.textColor,
        }
    }

    // setupDraggers() {
    //     // 左右两个拖拽点
    //     let left = GenDragger.new(this, 0, 0, 'crosshair', 'left')
    //     left.resetPosition = function() {
    //         this.x = this.offsetX + this.owner.x - this.w / 2
    //         this.y = this.offsetY + this.owner.y - this.h / 2 + this.owner.h / 2
    //     }
    //     this.addDragger(left)

    //     let right = GenDragger.new(this, 0, 0, 'crosshair', 'right')
    //     right.resetPosition = function() {
    //         this.x = this.offsetX + this.owner.x - this.w / 2 + this.owner.w
    //         this.y = this.offsetY + this.owner.y - this.h / 2 + this.owner.h / 2
    //     }
    //     this.addDragger(right)
    // }

    selected() {
        super.selected()
        this.updateControls("config.textFont.value", this.font)
        this.updateControls("config.textColor.value", this.color)
        return GenText.configAttribute()
    }
    
    static new (...args) {
        return new this(...args)
    }

    fillProp(prop) {
        for (let p of Object.keys(prop)) {
            this[p] = prop[p]
        }
        return this
    }

    pointInShapeFrame(x, y) {
        return this.pointInFrame(x, y)
    }

    connectDraggers() {
        // 连接四个拖拽点
        this.position = {
            'leftTop': Vector.new(this.x, this.y),
            'leftBottom': Vector.new(this.x, this.y + this.h),
            'rightTop': Vector.new(this.x + this.w, this.y),
            'rightBottom': Vector.new(this.x + this.w, this.y + this.h),
        }
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
    
    drawtext() {
        let lines = this.text.split('\n')
        let max = lines[0]
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i]
            if (!isBlank(line) && line.length > max.length) {
                max = line
            }
        }
        // 如果是多行文本, 向后遍历到第一个不为 0 的宽度就是字体框的宽度
        this.w = calTextWH(max, this.font).w
        // 单行文本
        let rows = getRows(this.text, this.w, this.font)
        for(let b = 0; b < rows.length; b++){
            this.context.fillText(rows[b], this.x, this.y + (b + 1) * this.h)
        }
        // 更新高度
        this.h = rows.length * this.h
    }

    update() {
        let p = calTextWH(this.text, this.font)
        this.w = p.w
        this.h = p.h
    }

    draw() {
        this.context.save()
        this.context.font = this.font
        this.context.fillStyle = this.color
        this.context.textBaseline = "bottom"
        this.drawtext()
        // this.context.wrapText(this.text, this.x, this.y, 100, this.h)
        this.context.restore()
        // log("this.dragger", this)
        super.draw()
    }
}