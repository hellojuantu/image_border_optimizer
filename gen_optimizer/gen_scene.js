class GenScene {
    constructor(optimizer) {
        this.optimizer = optimizer
        this.canvas = optimizer.canvas
        this.context = optimizer.context
        this.panels = optimizer.panels
        this.ratio = this.optimizer.ratio
        this.elements = []
        this.events = {}
        this.pageClass = {}
        this.components = {}
        this.inUsedComponentNames = []
        this.pointInScene = false
        this.setupMouseleave()
    }

    static new(...args) {
        return new this(...args)
    }

    // 上传图片需要刷新的配置
    refreshConfig(tempImages) {
        
    }

    // 更新左边的图片快照
    updateActivePanelSnapshot() {

    }

    /**
     * 注册鼠标是否在场景事件
     */
     setupMouseleave() {
        this.optimizer.resgisterMouse((event, action) => {     
            if (action == 'mouseleave') {
                this.pointInScene = false
                log('mouseleave canvas', this.pointInScene)
            } else if (action == 'mouseenter') {
                this.pointInScene = true
                log("mouseenter canvas", this.pointInScene)
            }
        })
    }

    registerPageClass(prop) {
        for (let c of Object.keys(prop)) {
            this.pageClass[c] = prop[c]
        }
        return this
    }
    
    bindComponent(name, component) {
        this.components[name] = component
    }

    getComponent(name) {
        if (!this.inUsedComponentNames.includes(name)) {
            this.inUsedComponentNames.push(name)
            // 初始化组件的事件
            this.components[name].setupEvents()
        }
        log("inUsedComponentNames", this.inUsedComponentNames)
        return this.components[name]
    }

    registerGlobalEvents(sceneEvents) {
        let self = this
        log("scene", sceneEvents)
        for (let event of sceneEvents) {
            let eventName = event.eventName
            let className = event.className
            let selector = sel(className)
            let after = event.after
            let before = event.before
            let useCapture = event.useCapture || false
            let configToEvents = event.configToEvents || {}
            self.bindConfigEvents(className, eventName, configToEvents)
            log("selector, eventName, configToEvents", selector, eventName, configToEvents)
            bindAll(selector, eventName, function(event) {
                let target = event.target
                let bindVar = target.dataset.value
                // log("eventName, events, bindVar: ", eventName, self.events, bindVar)
                let eventId = self.eventId(className, eventName, bindVar)
                log("eventId", eventId)
                let eventFunc = self.events[eventId]
                before && before(bindVar, target)
                // 某个配置区域独有的事件
                eventFunc && eventFunc(target)
                after && after(bindVar, target)
            }, useCapture)
        }        
    }

    bindConfigEvents(className, eventName, configToEvents) {
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
            let eventId = self.eventId(className, eventName, bindVar)
            self.bindEvent(eventId, eventFun)
        }
    }

    /**
     * className eventName bindVar 三者才能确定一个事件
     */
    eventId(className, eventName, bindVar) {
        return className + "->" + eventName + "->" + bindVar
    }

    bindEvent(eventName, events) {
        this.events[eventName] = events
    }

    addElement(controller) {
        this.elements.push(controller)
    }

    draw() {
        for (let i = 0; i < this.elements.length; i++) {
            let e = this.elements[i]
            e.draw()
        }
    }

    update() {
        for (let i = 0; i < this.elements.length; i++) {
            let e = this.elements[i]
            e.update()
        }
    }
}