class GenScene {
    constructor(optimizer) {
        this.optimizer = optimizer
        this.canvas = optimizer.canvas
        this.context = optimizer.context
        this.images = optimizer.images
        this.elements = []
        this.events = {}
        //
        this.insertControls()
        this.bindControlsEvents()
        this.updateControls("config.index.max", this.images.length - 1)
    }

    static new(...args) {
        return new this(...args)
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
                let parsedValue = this.parseValueWithType(updateValue, config[bind]['valueType'])
                // update config
                config[bind][prop] = parsedValue
                // update html slide
                slide[prop] = parsedValue
                if (prop == 'value') {
                    let label = slide.closest('label').querySelector('.gen-label')
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

    bindControlsEvents() {
        var self = this

        bindAll('.gen-auto-button', 'click', function(event) {
            var target = event.target
            var bindVar = target.dataset.value
            self.events[bindVar] && self.events[bindVar](target)
        })
    
        bindAll('.gen-auto-slider', 'input', function(event) {
            var target = event.target
            var bindVar = target.dataset.value
            var v = target.value
            self.updateControls(bindVar + '.value', v)
        })
    }

    addEvent(eventName, callback) {
        this.events[eventName] = callback
    }

    addElement(controller) {
        this.elements.push(controller)
    }

    draw() {
        for (let i = 0; i < this.elements.length; i++) {
            var e = this.elements[i]
            e.draw()
        }
    }

    update() {
        for (let i = 0; i < this.elements.length; i++) {
            var e = this.elements[i]
            e.update()
        }
    }

    insertControls() {
        var div = e(".gen-controls")
        var keys = Object.keys(config)
        for (var k of keys) {
            var item = config[k]
            var html = this.templateControls(k, item)
            appendHtml(div, html)
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
}