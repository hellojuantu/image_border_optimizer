class ImageControls extends GenControls {
    constructor(scene) {
        super(scene)
        this.setupImageChanges()
    }

    setupImageChanges() {
        this.imageChanges = []
        for (let i = 0; i <= config.index.max; i++) {
            this.imageChanges.push({
                points: [],
                texts: [],
            })
        }
    }

    saveImage(points, texts) {
        this.imageChanges[config.index.value] = {
            points: points,
            texts: texts,
        }
    }

    draw() {
        var self = this
        let canvas = self.canvas
        let context = self.context
        var img = self.images[config.index.value]
        if (img == null) {
            return
        }
        // get config
        var offset = config.offset.value
        var io = config.imageOffset.value
        // 
        canvas.width = img.width + offset * 20
        canvas.height = img.height + offset * 20

        this.drawShadow(img, io)

        context.drawImage(img, io, io)

        this.drawBorder(img, io)
    }

    drawShadow(img, io) {
        var shadowOffset = config.shadowOffset.value
        this.context.save()
        this.context.globalAlpha = config.shadowColorAlpha.value / 10
        this.context.shadowOffsetX = shadowOffset
        this.context.shadowOffsetY = shadowOffset
        this.context.shadowColor = config.shadowColor.value
        this.context.shadowBlur = config.shadowBlur.value
        this.context.fillRect(io, io, img.width, img.height)
        this.context.restore()
    }

    drawBorder(img, io) {
        this.context.save()
        this.context.lineWidth = config.borderLength.value
        this.context.strokeStyle = config.borderColor.value
        this.context.beginPath()
        this.context.moveTo(io, io)
        this.context.lineTo(io, io + img.height)
        this.context.lineTo(io + img.width, io + img.height)
        this.context.lineTo(io + img.width, io)
        this.context.lineTo(io, io)
        this.context.closePath()
        this.context.stroke()
        this.context.restore()
    }
}