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
            // 实时更新画布大小
            let w = config.canvasWidth.value
            let h = config.canvasHeight.value
            self.optimizer.updateCanvasHW(h, w)
            context.drawImage(img, 0, 0)
            return
        }
        // 实时更新画布大小
        let offset = config.imageOffset.value
        let w = config.canvasWidth.value + offset
        let h = config.canvasHeight.value + offset
        self.optimizer.updateCanvasHW(h, w)
        //
        let c_w = canvas.width / this.ratio
        let c_h = canvas.height / this.ratio
        // temp fix, other version will kill
        let otherOffset = config.shadowOffset.value
        let centerOffsetX = (c_w - img.width - otherOffset) / 2
        let centerOffsetY = (c_h - img.height - otherOffset) / 2

        this.drawShadow(img, centerOffsetX, centerOffsetY)

        this.drawWhiteBg(img, centerOffsetX, centerOffsetY)

        context.drawImage(img, centerOffsetX * this.ratio, centerOffsetY * this.ratio, img.width * this.ratio, img.height * this.ratio)        
        
        this.drawBorder(img, centerOffsetX, centerOffsetY)        
    }

    drawWhiteBg(img, x, y) {
        let context = this.context
        context.save()
        context.fillStyle = "#fff"
        context.fillRect(x, y, img.width, img.height)
        context.restore()
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

    defaultConfigAttribute() {
        let config = this.configAttribute()
        Object.values(config).forEach((c) => {
            c['value'] = c['default']
        })
        return config 
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