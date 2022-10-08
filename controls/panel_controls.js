class PanelControls extends GenControls {
    constructor(scene) {
        super(scene)
        this.imageChanges = []
    }

    delete(index) {
        this.panels.splice(index, 1)
        this.imageChanges.splice(index, 1)
    }

    getChanges(index) { 
        return this.imageChanges[index] || {
            points: [],
            texts: [],
            shapes: [],
        }
    }

    save(points, texts, shapes) {
        this.imageChanges[config.index.value] = {
            points: points,
            texts: texts,
            shapes: shapes,
        }
    }

    draw() {
        let self = this
        let canvas = self.canvas
        let context = self.context
        // log("image draw", self.images)
        let img = self.panels[config.index.value]
        if (img == null) {
            return
        }
        // 空白页面, 不加阴影
        if (img.dataset.type == 'default_blank') {
            context.drawImage(img, 0, 0)
            return
        }
        // get config
        let c_w = canvas.width / this.ratio
        let c_h = canvas.height / this.ratio
        let centerOffsetX = (c_w - img.width) / 2
        let centerOffsetY = (c_h - img.height) / 2

        this.drawShadow(img, centerOffsetX, centerOffsetY)

        context.drawImage(img, centerOffsetX * this.ratio, centerOffsetY * this.ratio, img.width * this.ratio, img.height * this.ratio)

        this.drawBorder(img, centerOffsetX, centerOffsetY)        
    }

    drawShadow(img, ox, oy) {
        let shadowOffset = config.shadowOffset.value
        this.context.save()
        this.context.globalAlpha = config.shadowColorAlpha.value / 10
        this.context.shadowOffsetX = shadowOffset
        this.context.shadowOffsetY = shadowOffset
        this.context.shadowColor = config.shadowColor.value
        this.context.shadowBlur = config.shadowBlur.value
        this.context.fillRect(ox, oy, img.width, img.height)
        this.context.restore()
    }

    drawBorder(img, ox, oy) {
        this.context.save()
        this.context.lineWidth = config.borderLength.value
        this.context.strokeStyle = config.borderColor.value
        this.context.beginPath()
        this.context.moveTo(ox, oy)
        this.context.lineTo(ox, oy + img.height)
        this.context.lineTo(ox + img.width, oy + img.height)
        this.context.lineTo(ox + img.width, oy)
        this.context.lineTo(ox, oy)
        this.context.closePath()
        this.context.stroke()
        this.context.restore()
    }

    configAttribute() {
        return {
            "config.borderLength": config.borderLength, 
            "config.borderColor": config.borderColor,
            "config.shadowOffset": config.shadowOffset,
            "config.shadowColorAlpha": config.shadowColorAlpha,
            "config.shadowColor": config.shadowColor,
            "config.shadowBlur": config.shadowBlur,
            "config.imageOffset": config.imageOffset,
        }
    }
}