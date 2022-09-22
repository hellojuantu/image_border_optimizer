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

    registerGlobalEvents(sceneEvents) {
        let self = this
        log("scene", sceneEvents)
        for (let event of sceneEvents) {
            let eventName = event.eventName
            let className = event.className
            let selector = sel(className)
            let callback = event.callback
            let configToEvents = event.configToEvents || {}
            self.bindConfigEvents(eventName, configToEvents)
            log("selector, eventName", selector, eventName)
            bindAll(selector, eventName, function(event) {
                let target = event.target
                let bindVar = target.dataset.value
                // log("eventName, events, bindVar", eventName, self.events, bindVar)
                let eventId = self.eventId(eventName, bindVar)
                let eventFunc = self.events[eventId]
                // 某个配置区域独有的事件
                eventFunc && eventFunc(target)
                // 全局的事件
                callback && callback(bindVar, target)
            })
        }        
    }

    bindConfigEvents(eventName, configToEvents) {
        /**
            eventName -> "input",
            configToEvents -> {
                "config.textFont": function(target) {},
                "config.textColor": function(target) {},
            }
        */
        let self = this
        for (let bindVar of Object.keys(configToEvents)) {
            let eventFun = configToEvents[bindVar]
            let eventId = self.eventId(eventName, bindVar)
            self.bindEvent(eventId, eventFun)
        }
    }

    eventId(eventName, bindVar) {
        return eventName + "->" + bindVar
    }

    bindEvent(eventName, events) {
        this.events[eventName] = events
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