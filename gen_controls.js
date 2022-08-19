class GenControls {
    constructor(optimizer) {
        this.canvas = optimizer.canvas
        this.context = optimizer.context
        this.images = optimizer.images
        this.pen = GenPen.new(optimizer)
    }

    static new (...args) {
        return new this(...args)
    }

    init() {
        this.insertControls()
        this.bindControlsEvents()
        this.updateControls("config.index.max", this.images.length - 1)
    }

    insertControls() {
        var div = e(".gen-controls")
        var keys = Object.keys(config)
        for (var k of keys) {
            var item = config[k]
            var html = this.templateControls(k, item)
            div.insertAdjacentHTML('beforeend', html)
        }
    }
    
    // config.xxx.prop = updateValue
    updateControls(bindVarStr, updateValue) {
        var list = bindVarStr.split(".")
        var bind = list[1]
        var prop = list[2]
        var sliders = es('.gen-auto-slider')
        for (let i = 0; i < sliders.length; i++) {
            let slide = sliders[i]
            let bindVar = slide.dataset.value
            if (bindVar == `config.${bind}`) {
                if (config[bind]['valueType'] == 'number') {
                    updateValue = parseInt(updateValue)
                } else if (config[bind]['valueType'] == 'string') {
                    updateValue = String(updateValue)
                }
                // update config
                config[bind][prop] = updateValue
                // update html slide
                slide[prop] = updateValue
                if (prop == 'value') {
                    var label = slide.closest('label').querySelector('.gen-label')
                    label.innerText = updateValue
                }
                break
            }
        }
    }

    templateControls(key, item) {
        var minAndMax = `
            max = ${item.max}
            min = ${item.min}
        `
        var inputAndRange = `
            <input class='gen-auto-slider' type="${item.type}"
                value="${item.value}"
                ${item.type == 'range' ? minAndMax : ''}
                data-value="config.${key}"
                data-type="${item.type}"
                >
            ${item._comment}: <span class="gen-label">${item.value}</span>
        `
        var button = `
            <div class="gen-controller">
                <label>
                    <button class='gen-auto-button' data-type="${item.type}" data-value="config.${key}">${item._comment}</button>
                </label>
            </div>
        `
        var t = `
            <div class="gen-controller">
                <label>
                    ${item.type == 'button' ? button : inputAndRange}
                </label>
            </div>
        `
        return t
    }

    bindControlsEvents() {
        var self = this
  
        var events = {
            "config.preButton": function(target) {
                log("preButton")
                if (config.index.value > 0) {
                    var v = config.index.value - 1
                    self.updateControls("config.index.value", v)
                }
            },
            "config.nextButton": function(target) {
                if (config.index.value < self.images.length - 1) {
                    var v = config.index.value + 1
                    self.updateControls("config.index.value", v)
                }
            },
            "config.centerButton": function(target) {
                var w = self.canvas.width
                var img = self.images[config.index.value]
                var imgW = img.width
                self.updateControls('config.imageOffset.value', (w - imgW) / 2)
            }
        }

        bindAll('.gen-auto-button', 'click', function(event) {
            var target = event.target
            var bindVar = target.dataset.value
            events[bindVar] && events[bindVar](target)
            self.drawImage()
        })
    
        bindAll('.gen-auto-slider', 'input', function(event) {
            var target = event.target
            var bindVar = target.dataset.value
            var v = target.value
            self.updateControls(bindVar + '.value', v)
            var label = target.closest('label').querySelector('.gen-label')
            label.innerText = v
            self.drawImage()
        })
    }

    drawImage() {
        var self = this
        var img = self.images[config.index.value]
        if (img == null) {
            return
        }
        // get config
        var offset = config.offset.value
        var io = config.imageOffset.value
        var shadowOffset = config.shadowOffset.value
        // 
        this.canvas.width = img.width + offset * 20
        this.canvas.height = img.height + offset * 20
    
        // clear canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    
        // shadow
        this.context.save()
        this.context.globalAlpha = config.shadowColorAlpha.value / 10
        this.context.shadowOffsetX = shadowOffset
        this.context.shadowOffsetY = shadowOffset
        this.context.shadowColor = config.shadowColor.value
        this.context.shadowBlur = config.shadowBlur.value
        this.context.fillRect(io, io, img.width, img.height)
        this.context.restore()
    
        // draw main image
        this.context.drawImage(img, io, io)
    
        // draw shadow and border
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