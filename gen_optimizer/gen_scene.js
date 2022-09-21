class GenScene {
    constructor(optimizer) {
        this.optimizer = optimizer
        this.canvas = optimizer.canvas
        this.context = optimizer.context
        this.images = optimizer.images
        this.elements = []
        this.events = {}
        this.pageClass = {}
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

    refreshConfig() {
        
    }

    registerPageClass(prop) {
        for (let c of Object.keys(prop)) {
            this.pageClass[c] = prop[c]
        }
        return this
    }

    bindTemplate(template) {
        var div = e("." + this.pageClass.controls)
        var keys = Object.keys(config)
        for (var k of keys) {
            var item = config[k]
            var html = template(this, k, item)
            appendHtml(div, html)
        }
    }

    registerSceneEvents(sceneEvents) {
        let self = this
        for (let eventName of Object.keys(sceneEvents)) {
            let selector = "." + sceneEvents[eventName].pageClass
            let callback = sceneEvents[eventName].callback
            bindAll(selector, eventName, function(event) {
                var target = event.target
                var bindVar = target.dataset.value
                // log("eventName, events, bindVar", eventName, self.events, bindVar)
                var clickEvents = self.events[eventName]
                clickEvents[bindVar] && clickEvents[bindVar](target)
                callback && callback(bindVar, target)
            })
        }        
    }

    bindEvent(eventName, configToCallback) {
        this.events[eventName] = configToCallback
    }

    bindEvents(configEvents) {
        // 遍历 configEvents 绑定事件
        for (let eventName in configEvents) {
            let configToCallback = configEvents[eventName]
            this.bindEvent(eventName, configToCallback)
        } 
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
}