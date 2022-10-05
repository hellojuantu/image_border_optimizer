class GenOptimizer {
    constructor(runCallback) {
        this.runCallback = runCallback
        window.fps = 10
        this.setup()
    }

    static instance(runCallback) {
        this.i = this.i || new this(runCallback)
        return this.i
    }

    enableDebugMode() {
        log = console.log.bind(console)
    }

    setCursor(cursor) {
        this.canvas.style.cursor = cursor
    }

    getCursor() {
        return this.canvas.style.cursor
    }

    setup() {
        // canvas
        this.canvasArea = e("#id-canvas-area")
        this.canvas = e("#id-canvas")
        this.context = this.canvas.getContext('2d')
        // blank image
        this.blankImage = {
            src: this.canvas.toDataURL("image/png"),
            w: this.canvas.width,
            h: this.canvas.height,
        }
        // 
        this.scene = null
        // image and upload
        this.images = []
        this.imageSnapshots = []
        this.setupBlankImage()
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
        this.__start()
    }

    defaultBlankImage() {
        let image = new Image()
        image.src = this.blankImage.src
        image.width = this.blankImage.w
        image.height = this.blankImage.h
        image.dataset.type = 'default_blank'
        return image
    }

    setupBlankImage() {
        let blankImage = this.defaultBlankImage()
        this.images.push(blankImage)
        this.imageSnapshots.push(blankImage)
    }

    setupNotice() {
        let notice = "Drag images here to start !!!"
        this.context.save()
        this.context.textBaseline = "top"
        this.context.font = '24px arial'
        let metrics = this.context.measureText(notice)
        let w = metrics.width
        let h = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent

        this.context.fillStyle = "red"
        this.context.fillText(notice, (this.canvas.width - w) / 2, (this.canvas.height - h) / 2)        
        this.context.restore()
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
        this.scene.refreshConfig(this.images)
        // 开始运行程序
        setTimeout(function(){
            self.runloop()
        }, 1000 / window.fps)
    }

    draw() {
        this.scene.draw()
        // update snapshot
        this.scene.updateActiveImageSnapshot()
    }

    update() {
        this.scene.update()
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
        g.update()
        // clear
        g.context.clearRect(0, 0, g.canvas.width, g.canvas.height)        
        // draw
        g.draw()                
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
            let tempImages = []
            for (let i = 0; i < files.length; i++) {
                let file = files[i]
                let reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onload = function (e) {
                    let img = new Image()
                    img.src = e.target.result
                    img.dataset.type = 'user_upload'
                    img.onload = function() { 
                        tempImages.push(img)
                        self.images.push(img)
                        log("tempImages len, file len", self.images.length, files.length)
                        // 上传图片, 刷新配置
                        if (tempImages.length == files.length) {
                            log("__start")
                            self.scene && self.scene.refreshConfig(tempImages)
                        }
                    }
                }
            }
        })
    }

}