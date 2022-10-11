class GenOptimizer {
    constructor(runCallback) {
        this.runCallback = runCallback
        window.fps = 90
        this.setup()
    }

    static instance(runCallback) {
        this.i = this.i || new this(runCallback)
        return this.i
    }

    async loadImageToClipboard() {
        try {
            this.updateAndDraw()
            let url = this.canvas.toDataURL("image/png")
            const data = await fetch(url)
            const blob = await data.blob()
            await navigator.clipboard.write([
                new window.ClipboardItem({
                    [blob.type]: blob
                })
            ])        
            alert('复制成功')
        } catch (err) {
            alert('复制失败')
        }
    }

    updateCanvasHW(h, w) {
        let canvas = this.canvas
        canvas.width = w * this.ratio
        canvas.height = h * this.ratio 
        canvas.style.width = w + 'px'
        canvas.style.height = h + 'px'
    }

    enableDebugMode() {
        log = console.log.bind(console)
    }

    getPixelRatio() {
        let context = this.context
        let backingStore = context.backingStorePixelRatio ||
              context.webkitBackingStorePixelRatio ||
              context.mozBackingStorePixelRatio ||
              context.msBackingStorePixelRatio ||
              context.oBackingStorePixelRatio ||
              context.backingStorePixelRatio || 1
    
        return (window.devicePixelRatio || 1) / backingStore
    }

    setCursor(cursor) {
        this.canvas.style.cursor = cursor
    }

    getCursor() {
        return this.canvas.style.cursor
    }

    setupWrapper() {
        let self = this
        let zoom = config.zoom.value / 100
        let wrapper = this.canvasWrapper
        wrapper.style.height = (self.canvas.height * zoom) / self.ratio + "px"
        wrapper.style.width = (self.canvas.width * zoom) / self.ratio + "px"
    }

    setup() {
        // canvas
        this.canvasArea = e("#id-canvas-area")
        this.canvasWrapper = e("#id-canvas-wrapper")
        this.canvas = e("#id-canvas")
        this.context = this.canvas.getContext('2d')
        this.ratio = this.getPixelRatio()
        // blank image
        this.blankPanel = {
            src: this.canvas.toDataURL("image/png"),
            w: this.canvas.width,
            h: this.canvas.height,
        }
        // 
        this.scene = null
        // image and upload
        this.panels = []
        this.panelSnapshots = []
        this.setupBlankPanel()
        //
        this.bindUploadEvents()
        // key
        this.actions = {}
        this.keydowns = {}
        window.addEventListener('keydown', event => {
            log("keydown", event.key)
            this.keydowns[event.key] = 'down'
        })
        window.addEventListener('keyup', event => {
            this.keydowns[event.key] = 'up'
        })
        // mouse
        this.mouseActions = []
        this.setupMouse()
        // setup wrapper width and height
        this.setupWrapper()
        this.__start()
    }

    defaultBlankPanel() {
        let image = new Image()
        image.src = this.blankPanel.src
        image.width = this.blankPanel.w
        image.height = this.blankPanel.h
        image.dataset.type = 'default_blank'
        return image
    }

    setupBlankPanel() {
        let blankPanel = this.defaultBlankPanel()
        this.panels.push(blankPanel)
        this.panelSnapshots.push(blankPanel)
    }
    
    setupMouse() {
        let self = this
        let moving = false
        this.canvas.addEventListener('mousedown', event => {
            moving = true
            for (const a of self.mouseActions) {
                a(event, 'down')
            }
        })
        this.canvas.addEventListener('mousemove', event => {
            if (moving) {
                for (const a of self.mouseActions) {
                    a(event, 'move')
                }
            } else {
                for (const a of self.mouseActions) {
                    a(event, 'overmove')
                }
            }
        })
        this.canvas.addEventListener('mouseup', event => {
            moving = false
            for (const a of self.mouseActions) {
                a(event, 'up')
            }
        })
        this.canvas.addEventListener('dblclick', event => {
            moving = false
            for (const a of self.mouseActions) {
                a(event, 'dblclick')
            }
        })
        this.canvas.addEventListener('mouseleave', event => {
            moving = false
            for (const a of self.mouseActions) {
                a(event, 'mouseleave')
            }
        })
        this.canvas.addEventListener('mouseenter', event => {
            moving = false
            for (const a of self.mouseActions) {
                a(event, 'mouseenter')
            }
        })
    }
    
    registerAction(key, callback) {
        this.actions[key] = callback
    }

    resgisterMouse(callback) {
        this.mouseActions.push(callback)
    }

    runWithScene(scene) {
        let self = this
        this.scene = scene                
        // 第一次加载需要刷新的配置
        this.scene.refreshConfig(this.panels)
        // 开始运行程序
        setTimeout(function(){
            self.runloop()
        }, 1000 / window.fps)
    }

    draw() {
        this.scene.draw()
        // update snapshot
        this.scene.updateActivePanelSnapshot()
    }

    update() {
        this.scene.update()
    }

    updateAndDraw() {
        let g = this
        // update
        g.update()
        // clear
        g.context.clearRect(0, 0, g.canvas.width, g.canvas.height)        
        // draw
        g.draw()  
    }

    runloop() {
        // log(window.fps)
        // events
        let g = this
        let actions = Object.keys(g.actions)
        // log("actions", g.actions)
        for (let i = 0; i < actions.length; i++) {
            let key = actions[i]
            let status = g.keydowns[key]
            // log("status", status)
            if (status == 'down') {
                g.actions[key]('down')
            } else if (status == 'up') {
                g.actions[key]('up')
                g.keydowns[key] = null
            }           
        }                    
        // update
        g.updateAndDraw()            
        // next run loop
        setTimeout(function(){
            g.runloop()
        }, 1000 / window.fps)
    }

    __start() {
        this.runCallback(this)
    }

    bindUploadEvents() {
        let self = this
        let dp = e('.image-list')
    
        dp.addEventListener('dragover', function (e) {
            e.stopPropagation()
            e.preventDefault()
            e.dataTransfer.dropEffect = 'copy'
        })
    
        dp.addEventListener("drop", function (e) {
            e.stopPropagation()
            e.preventDefault()
            let files = Object.values(e.dataTransfer.files).filter(
                f => f.type.includes("image")
            )
            let tempPanels = []
            for (let i = 0; i < files.length; i++) {
                let file = files[i]
                let reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onload = function (e) {
                    let img = new Image()
                    img.src = e.target.result
                    img.dataset.type = 'user_upload'
                    img.onload = function() { 
                        tempPanels.push(img)
                        self.panels.push(img)
                        log("tempPanels len, file len", self.panels.length, files.length)
                        // 上传图片, 刷新配置
                        if (tempPanels.length == files.length) {
                            log("__start")
                            self.scene && self.scene.refreshConfig(tempPanels)
                        }
                    }
                }
            }
        })
    }

}