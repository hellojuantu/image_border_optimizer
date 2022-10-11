class PageConfigControls extends GenControls {
    constructor(scene, panelControl, penControl, textControl, shapeControl) {
        super(scene)
        this.panelControl = panelControl
        this.penControl = penControl
        this.textControl = textControl
        this.shapeControl = shapeControl
        this.setup()
        this.setupCorsorEvent()
        this.setupMoveEvent()
        this.setupDraggerEvent()
        this.setupUploadImageEvent()
    }

    /**
     * 初始化所有页面配置
     */
    setup() {
        let self = this
        let sc = self.scene
        
        // 注册页面 class, 全局可用
        sc.registerPageClass({
            "button": 'gen-auto-button',
            "canvas": 'content',
            "drawer": 'gen-switch-drawer',
            "home": "home",
            'attribute': "gen-attribute",
            'input': 'gen-input',
            'images': 'image-list',
            'imageBlock': 'image-block',
            'shapeActive': 'shape-active',
            'zoom': 'canvas-zoom',
            'canvasHW': 'canvas-hw',
        })

        // 绑定组件, 全局可用
        // 右边属性组件
        sc.bindComponent('attribute', Attribute.new(this))
        // 左边图片选择组件
        sc.bindComponent('panelSelector', PanelSelector.new(this))

        // 注册全局场景事件
        sc.registerGlobalEvents([               
            // 左上按钮事件
            {
                eventName: "click",
                className: sc.pageClass.button,
                configToEvents: {
                    "config.preButton": function(target) {
                        // log("preButton", config.index.value)
                        if (config.index.value > 0) {
                            self.savePanel()
                            let v = config.index.value - 1
                            self.switchPanel(v)                          
                        }
                    },
                    "config.nextButton": function(target) {
                        // log("nextButton", config.index.value, self.images.length)
                        if (config.index.value < self.panels.length - 1) {
                            // 保存当前图片的修改
                            self.savePanel()
                            // 更新画笔和文字
                            let v = config.index.value + 1
                            self.switchPanel(v)                          
                        }
                    },                  
                    "config.penClearButton": function(target) {
                        // log("penClearButton")
                        self.penControl.resetAndUpdate([])
                        self.textControl.resetAndUpdate([])
                        self.shapeControl.resetAndUpdate([])
                    },
                    "action.copyImageButton": function(target) {
                        log("copyImageButton")
                        // 遍历所有的 shape 变成 idle
                        for (let i = 0; i < self.shapeControl.shapes.length; i++) {
                            let shape = self.shapeControl.shapes[i]
                            shape.idle()
                        }
                        self.shapeControl.removeDraggers()
                        let g = self.optimizer
                        g.loadImageToClipboard()                    
                    },
                    "action.newBlank": function(target) {
                        let b = self.optimizer.defaultBlankPanel()
                        self.panels.push(b)
                        let tempPanels = []
                        tempPanels.push(b)
                        sc.getComponent('panelSelector').buildWith(tempPanels)
                        config.index.max = self.panels.length - 1
                    },
                },
            },            
            // 右上角按钮事件
            {
                eventName: "click",
                className: sc.pageClass.drawer,
                before: function(bindVar, target) {
                    log("drawer", bindVar, target)
                    let shapeActive = sc.pageClass.shapeActive
                    removeClassAllWithCallback(shapeActive, (e) => {
                        let bindVar = e.dataset.value
                        eval(bindVar + '.value=false')
                    }) 
                    target.classList.add(shapeActive)
                    eval(bindVar + '.value=' + parseBoolean(target.classList.contains(shapeActive)))
                },
                configToEvents: {                    
                    "config.penEnabled": function(target) {
                        sc.getComponent('attribute').buildWith(GenPoint.configAttribute())
                    },
                    "config.textInputEnabled": function(target) {
                        sc.getComponent('attribute').buildWith(GenText.configAttribute())                
                    },
                    "config.shapeEnabled": function(target) {
                        let shape = config.shapeSelect.value = target.dataset.shape                                                         
                        // 显示右边属性 
                        let att = self.shapeControl.shapeTypes[shape].configAttribute()
                        sc.getComponent('attribute').buildWith(att)
                    },      
                    "config.defaultPointerEnable": function(target) {
                        sc.getComponent('attribute').buildWith(self.panelControl.configAttribute())
                    }
                }
            },
            {
                eventName: 'input',
                className: sc.pageClass.zoom,
                configToEvents: {
                    "action-zoom": function(target)  {
                        config.zoom.value = self.parseValueWithType(target.value, 'number')
                        let zoom = config.zoom.value / 100
                        let wrapper = e("#id-canvas-wrapper")
                        wrapper.style.height = (self.canvas.height * zoom) / self.ratio + "px"
                        wrapper.style.width = (self.canvas.width * zoom) / self.ratio + "px"
                        self.canvas.style.transform = `scale(${zoom})`
                        // 需要更新输入框的位置
                        self.textControl.updateFloatTextPosition(zoom)
                    },
                },
            },
            {
                eventName: 'input',
                className: sc.pageClass.canvasHW,
                configToEvents: {
                    "action-canvasHW": function(target)  {
                        log("target", target, target.dataset.prop, target.value)
                        let prop = target.dataset.prop
                        if (prop == 'height') {
                            config.canvasHeight.value = self.parseValueWithType(target.value, 'number') 
                        } else {
                            config.canvasWidth.value = self.parseValueWithType(target.value, 'number') 
                        }
                        self.optimizer.updateCanvasHW(config.canvasHeight.value, config.canvasWidth.value)
                    },
                }
            }
        ])

        // 更新图片快照
        sc.updateActivePanelSnapshot = function() {
            let raw = this.panels[config.index.value]
            if (raw.dataset.type == 'default_blank') {
                e('.image-active > div > img').src = this.canvas.toDataURL("image/png")   
            }
        }

        // 上传图片需要刷新的配置
        // 每次上传图片都会调用
        sc.refreshConfig = function(tempPanels) {
            log("refreshConfig")
            sc.getComponent('panelSelector').buildWith(tempPanels)    
            config.index.max = self.panels.length - 1
        }

        // 使用组件构建属性
        sc.getComponent('attribute').buildWith(self.panelControl.configAttribute())
    }

    setupUploadImageEvent() {
        let self = this
        let dp = this.canvas
    
        dp.addEventListener('dragover', function (e) {
            e.stopPropagation()
            e.preventDefault()
            e.dataTransfer.dropEffect = 'copy'
        })
    
        dp.addEventListener("drop", function (e) {
            log("e", e.offsetX, e.offsetY)
            let x = e.offsetX
            let y = e.offsetY
            e.stopPropagation()
            e.preventDefault()
            let files = Object.values(e.dataTransfer.files).filter(
                f => f.type.includes("image")
            )
            for (let i = 0; i < files.length; i++) {
                let file = files[i]
                let reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onload = function (e) {
                    let img = new Image()
                    img.src = e.target.result
                    img.dataset.type = 'user_upload'
                    img.onload = function() { 
                        self.shapeControl.handleImageEvent(img, x, y)
                    }
                }
            }
        })
    }

    /**
     * 全局对象移动事件
     */
     setupMoveEvent() {
        let self = this       
        let draggedShape = null
        let sc = self.scene
        self.optimizer.resgisterMouse(function(event, action) {     
            if (parseBoolean(config.penEnabled.value)) {
                return
            }
            let x = event.offsetX
            let y = event.offsetY
            let targetShape = self.pointInElement(x, y)
            // log("targetShape", targetShape, self.shapeControl.shapes, action)
            if (action == 'down') {
                log("down", draggedShape)
                if (targetShape != null && !targetShape.isCreating()) {
                    draggedShape = targetShape                    
                    draggedShape.calcalateOffset(x, y)                    
                    let attributeMap = draggedShape.selected()
                    log("attributeMap", attributeMap)
                    sc.getComponent('attribute').buildWith(attributeMap)
                }
            } else if (action == 'move') {
                if (draggedShape != null && draggedShape.isSelected()) {
                    log("moving", draggedShape)
                    draggedShape.moving(x, y)
                    // 移动时激活 draggers
                    self.shapeControl.removeDraggers()
                    draggedShape.activateDraggers()
                }
            } else if (action == 'up') {
                if (draggedShape != null) {
                    draggedShape = null
                }                
            } 
        })
    }

    /**
     * 点击对象显示 dragger 事件
     */
    setupDraggerEvent() {
        let self = this  
        let sc = this.scene     
        self.optimizer.resgisterMouse(function(event, action) {    
            if (parseBoolean(config.penEnabled.value)) {
                return
            }
            let x = event.offsetX
            let y = event.offsetY
            let element = self.pointInElement(x, y)

            // 先处理 shape 的事件
            self.shapeControl.handleShapeEvent(action, x, y, element)

            if (action == 'up') {
                // element 创建的不符合要求会被删除
                if (element != null && element.isDeleted()) {
                    element = null
                }
                // 点击到空白的地方
                if (element == null) {
                    log("点击到空白的地方")
                    sc.getComponent('attribute').buildWith(self.panelControl.configAttribute())
                    self.shapeControl.removeDraggers()  
                    self.textControl.handleTextEvents(event, x, y)
                } else {
                    self.shapeControl.removeDraggers()
                    element.activateDraggers()
                }
            }
        })
    }

    /**
     * 变换鼠标 cursor 样式
     */
    setupCorsorEvent() {
        let self = this
        // 遍历所有的元素，设置鼠标样式
        self.optimizer.resgisterMouse(function(event, action) {
            if (parseBoolean(config.penEnabled.value)) {
                return
            }
            let x = event.offsetX
            let y = event.offsetY
            let element = self.pointInElement(x, y)
            // log("element", element)      
            if (action == 'overmove') {
                if (element != null && !element.isCreating()) {
                    // log("cursor", element.cursor)
                    let cursor = element.cursor || 'move'
                    self.optimizer.setCursor(cursor)
                } else {
                    self.optimizer.setCursor('default')
                }
            }
        })
    }

    /**
     * 切换时, 需要保存图片的修改
     */
    savePanel() {
        let points = this.penControl.points
        let texts = this.textControl.texts
        let shapes = this.shapeControl.shapes
        this.panelControl.save(points, texts, shapes)
    }

    /**
     * 切换图片, 恢复图片的修改
     */
    switchPanel(imageIndex) {        
        let self = this
        let v = imageIndex
        config.index.value = v
        self.penControl.resetAndUpdate(self.panelControl.getChanges(v).points)
        self.textControl.resetAndUpdate(self.panelControl.getChanges(v).texts)
        self.shapeControl.resetAndUpdate(self.panelControl.getChanges(v).shapes)    
        // css
        removeClassAll('image-active')
        for (let block of es('.image-block')) {
            if (block.dataset.index == v) {
                block.classList.add('image-active')                                
            }
        }

        let img = self.panels[v]
        let ratio = self.ratio
        let offset = 0
        if (img.dataset.type == "user_upload") {
            ratio = 1
            offset = config.imageOffset.value
        }

        // 重置属性
        for (let input of es('.canvas-hw-input')) {
            let prop = input.dataset.prop
            if (prop == 'width') {
                input.value = img.width / ratio
                config.canvasWidth.value = img.width / ratio
            } else if (prop == 'height') {
                input.value = img.height / ratio
                config.canvasHeight.value = img.height / ratio
            }
        }

        // 改变画布大小
        let w = config.canvasWidth.value + offset
        let h = config.canvasHeight.value + offset
        self.optimizer.updateCanvasHW(h, w)
    }

    // -------- 鼠标点击对象范围函数 --------
    pointInDraggers(x, y) {
        for (let dragger of this.shapeControl.allDraggers()) {
            if (dragger.pointInFrame(x, y) && dragger.active) {
                return dragger
            }
        }
        return null
    }

    pointInElement(x, y) {
        let dragger = this.pointInDraggers(x, y)
        if (dragger != null) {
            return dragger
        }
        let inShape = this.shapeControl.pointInShape(x, y)
        if (inShape != null) {
            return inShape
        }       
        
        return null
    }
}