class GenControls {
    constructor(scene) {
        this.optimizer = scene.optimizer
        this.canvas = this.optimizer.canvas
        this.context = this.optimizer.context
        this.images = this.optimizer.images
        this.scene = scene
    }

    static new(...args) {
        return new this(...args)
    }

    addElement() {
        this.scene.elements.push(this)
        return this
    }

    coordinateToCanvas(x, y) {
        let canvasBound = this.canvas.getBoundingClientRect()
        return {
            "x": x - canvasBound.left,
            "y": y - canvasBound.top,
        }
    }

    canvasToCoordinate(x, y) {
        let canvasBound = this.canvas.getBoundingClientRect()
        return {
            "x": x + canvasBound.left,
            "y": y + canvasBound.top,
        }
    }

    pageToCanvas(x, y) {
        let self = this
        return {
            "x": x - self.canvas.offsetLeft,
            "y": y - self.canvas.offsetTop,
        }
    }

    canvasToPage(x, y) {
        let self = this
        return {
            "x": x + self.canvas.offsetLeft,
            "y": y + self.canvas.offsetTop,
        }
    }

    pointInFrame(x, y) {
        let xIn = x >= this.x && x <= this.x + this.w
        let yIn = y >= this.y && y <= this.y + this.h
        return xIn && yIn
    }

    pointInHollowFrame(x, y, border) {
        // 坐标在空心矩阵边框上
        let xIn = x >= this.x - border && x <= this.x + this.w + border
        let yIn = y >= this.y - border && y <= this.y + this.h + border
        let inFrame = xIn && yIn
        // 坐标在空心矩阵内部
        let xIn2 = x >= this.x + border && x <= this.x + this.w - border
        let yIn2 = y >= this.y + border && y <= this.y + this.h - border
        let inHollow = xIn2 && yIn2
        return inFrame && !inHollow
    }
    
    // config.xxx.prop = updateValue
    updateControls(bindVarStr, updateValue) {
        var list = bindVarStr.split(".")
        var bind = list[1]
        var prop = list[2]
        var sliders = es(sel(this.scene.pageClass.slider))
        for (let i = 0; i < sliders.length; i++) {
            let slide = sliders[i]
            let bindVar = slide.dataset.value
            if (bindVar == `config.${bind}`) {
                let parsedValue = this.parseValueWithType(updateValue, config[bind]['valueType'])
                // update config
                config[bind][prop] = parsedValue
                // update html slide
                slide[prop] = parsedValue
                if (prop == 'value') {
                    let label = slide.closest('label').querySelector(sel(this.scene.pageClass.lable))
                    label.innerText = parsedValue
                }
                return
            }
        }
    }

    parseValueWithType(value, type) {
        switch (type) {
            case 'number':
                return parseInt(value)
            case 'string':
                return String(value)
            case 'boolean':
                return !parseBoolean(value)
            default:
                return value
        }
    }
    
    draw() {
    }

    update() {
    }
    
}