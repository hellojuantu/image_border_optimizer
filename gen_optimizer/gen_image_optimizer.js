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

    setCursor(cursor) {
        this.canvas.style.cursor = cursor
    }

    getCursor() {
        return this.canvas.style.cursor
    }

    setup() {
        // canvas
        this.canvas = e("#id-canvas")
        this.context = this.canvas.getContext('2d')
        this.setupNotice()
        // 
        this.scene = null
        // image and upload
        this.images = []
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
    }
    
    registerAction(key, callback) {
        this.actions[key] = callback
    }

    resgisterMouse(callback) {
        this.mouseActions.push(callback)
    }

    runWithScene(scene) {
        var self = this
        this.scene = scene
        // 第一次加载需要刷新的配置
        this.scene.refreshConfig()
        // 开始运行程序
        setTimeout(function(){
            self.runloop()
        }, 1000 / window.fps)
    }

    draw() {
        this.scene.draw()
    }

    update() {
        this.scene.update()
    }

    runloop() {
        // log(window.fps)
        // events
        var g = this
        var actions = Object.keys(g.actions)
        // log("actions", g.actions)
        for (var i = 0; i < actions.length; i++) {
            var key = actions[i]
            var status = g.keydowns[key]
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
        var self = this
        var dp = this.canvas
    
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
            for (var file of files) {
                var reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onload = function (e) {
                    let img = new Image()
                    img.src = e.target.result
                    img.onload = function() { 
                        self.images.push(img)
                        log("images len, file len", self.images.length, files.length)
                        // 上传图片, 刷新配置
                        // log("self.scene", self.scene)
                        self.scene && self.scene.refreshConfig()
                        if (self.images.length == files.length) {
                            log("__start")
                            self.__start()
                        }
                    }
                }
            }
        })
    }

}