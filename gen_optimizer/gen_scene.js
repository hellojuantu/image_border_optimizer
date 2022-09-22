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
        for (let pageClass of Object.keys(sceneEvents)) {
            let selector = "." + pageClass
            var eventName = sceneEvents[pageClass].eventName
            let callback = sceneEvents[pageClass].callback
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

    bindConfigEvents(configEvents) {
        // 遍历 configEvents 绑定事件
        for (let pageClass in configEvents) {
            let eventName =  this.sceneEvents[pageClass].eventName
            let configToCallback = configEvents[pageClass]
            log("event", eventName)
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