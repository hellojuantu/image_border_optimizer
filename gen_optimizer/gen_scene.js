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

    // 上传图片需要刷新的配置
    refreshConfig() {
        
    }

    registerPageClass(prop) {
        for (let c of Object.keys(prop)) {
            this.pageClass[c] = prop[c]
        }
        return this
    }

    buildPage(insertHtml) {
        insertHtml && insertHtml()
    }

    registerSceneEvents(sceneEvents) {
        let self = this
        this.sceneEvents = sceneEvents
        for (let className of Object.keys(sceneEvents)) {
            let selector = sel(className)
            let eventName = sceneEvents[className].eventName
            let callback = sceneEvents[className].callback
            // log("selector, eventName", selector, eventName)
            bindAll(selector, eventName, function(event) {
                var target = event.target
                var bindVar = target.dataset.value
                // log("eventName, events, bindVar", eventName, self.events, bindVar)
                var configEvents = self.events[eventName]
                // log("configEvents", configEvents)
                configEvents[bindVar] && configEvents[bindVar](target)
                // 
                callback && callback(bindVar, target)
            })
        }        
    }

    bindConfigEvents(configEvents) {
        // 遍历 configEvents 绑定事件
        for (let className in configEvents) {
            let eventName =  this.sceneEvents[className].eventName
            let configToCallback = configEvents[className]
            this.bindEvent(eventName, configToCallback)
        } 
    }

    bindEvent(eventName, configToCallback) {
        this.events[eventName] = configToCallback
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