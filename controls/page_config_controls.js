class PageConfigControls extends GenControls {
    constructor(scene, imageControl, penControl, textControl, shapeControl) {
        super(scene)
        this.imageControl = imageControl
        this.penControl = penControl
        this.textControl = textControl
        this.shapeControl = shapeControl
        this.setup()
        this.setupCorsorEvent()
        this.setupMove()
        this.setupMouseleave()
        this.setupDraggerEvent()
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
        })

        // 绑定组件, 全局可用
        // 右边属性组件
        sc.bindComponent('attribute', GenComponent.new(
            self.insertAttribute,
            self.templateAttribute,
        ))
        // 左边图片选择组件
        sc.bindComponent('imageSelector', GenComponent.new(
            self.insertImageSelector,
            self.templateImageSelector,
        ))

        // 注册全局场景事件
        sc.registerGlobalEvents([     
            // 属性的事件       
            {
                eventName: "input",
                className: sc.pageClass.attribute,
                after: function(bindVar, target) {
                    log("input", bindVar, target)
                    var v = target.value
                    self.updateControls(bindVar + '.value', v)
                },
                configToEvents: {
                    "config.textFont": function(target) {
                        if (self.textControl.inputOpen) {
                            let sel = "#" + self.textControl.inputId
                            let input = e(sel)
                            input.style.font = self.textControl.fixFont(target.value)
                            input.style.width = calTextWH(input.value, input.style.font).w + "px"
                        }
                    },
                    "config.textColor": function(target) {
                        if (self.textControl.inputOpen) {
                            let sel = "#" + self.textControl.inputId
                            let input = e(sel)
                            input.style.color = target.value
                        }
                    },
                    "config.shapeBorder": function(target) {
                        for (let shape of self.shapeControl.shapes) {
                            if (shape.isSelected()) {
                                shape.border = parseInt(target.value)
                            }
                        }
                    },
                    "config.shapeColor": function(target) {
                        for (let shape of self.shapeControl.shapes) {
                            if (shape.isSelected()) {
                                shape.color = target.value
                            }
                        }
                    },                   
                }
            },
            // 左上按钮事件
            {
                eventName: "click",
                className: sc.pageClass.button,
                configToEvents: {
                    "config.preButton": function(target) {
                        // log("preButton", config.index.value)
                        if (config.index.value > 0) {
                            self.saveImage()
                            var v = config.index.value - 1
                            self.switchImage(v)                          
                        }
                    },
                    "config.nextButton": function(target) {
                        // log("nextButton", config.index.value, self.images.length)
                        if (config.index.value < self.images.length - 1) {
                            // 保存当前图片的修改
                            self.saveImage()
                            // 更新画笔和文字
                            var v = config.index.value + 1
                            self.switchImage(v)                          
                        }
                    },
                    "config.centerButton": function(target) {
                        var w = self.canvas.width
                        var img = self.images[config.index.value]
                        if (img == null) {
                            return
                        }
                        var imgW = img.width
                        self.updateControls('config.imageOffset.value', (w - imgW) / 2)
                    },
                    "config.penClearButton": function(target) {
                        // log("penClearButton")
                        self.penControl.resetAndUpdate([])
                        self.textControl.resetAndUpdate([])
                        self.shapeControl.resetAndUpdate([])
                    },
                    "action.copyImageButton": function(target) {
                        log("copyImageButton")
                        clipboardImg(self.canvas.toDataURL("image/png"))
                    },
                    "action.newBlank": function(target) {
                        let b = self.optimizer.defaultBlankImage()
                        self.images.push(b)
                        let tempImages = []
                        tempImages.push(b)
                        sc.getComponent('imageSelector').buildWith(tempImages)
                        config.index.max = self.images.length - 1
                    },
                },
            },            
            // 右上角按钮事件
            {
                eventName: "click",
                className: sc.pageClass.drawer,
                before: function(bindVar, target) {
                    let shapeActive = sc.pageClass.shapeActive
                    if (target.classList.contains(shapeActive)) {
                        target.classList.remove(shapeActive)
                    } else {
                        removeClassAllWithCallback(shapeActive, (e) => {
                            let bindVar = e.dataset.value
                            eval(bindVar + '.value=false')
                        }) 
                        target.classList.add(shapeActive)
                    }
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
                }
            },
            // 左边图片列表事件
            {
                eventName: 'click',
                className: sc.pageClass.images,
                configToEvents: {                    
                    "config.index": function(target) {
                        let imageBlock = sel(sc.pageClass.imageBlock)
                        let index = target.closest(imageBlock).dataset.index
                        self.saveImage()
                        let v = parseInt(index)
                        self.switchImage(v)
                    },
                    "action.delete": function(target) {
                        let imageBlock = sel(sc.pageClass.imageBlock)
                        let outer = target.closest(imageBlock)
                        let delId = parseInt(outer.dataset.index)
                        // only one can't delete
                        if (es(imageBlock).length <= 1) {
                            return
                        }
                        removeWithCondition(imageBlock, (e) => {
                            return e.dataset.index == delId
                        })
                        let bs = es(imageBlock)
                        self.imageControl.delImage(delId)
                        config.index.max = self.images.length - 1                        
                        // 重新给 image-list 分配 index
                        for (let i = 0; i < bs.length; i++) {
                            bs[i].dataset.index = i                            
                        }
                        // 删除自己跳转到 index 0
                        if (delId == config.index.value) {
                            self.switchImage(0)
                        } else if (delId < config.index.value) {
                            config.index.value -= 1
                        }
                    }
                }
            },
            {
                eventName: 'input',
                className: sc.pageClass.zoom,
                configToEvents: {
                    "action-zoom": function(target)  {
                        config.zoom.value = parseInt(target.value)
                        let zoom = config.zoom.value / 100
                        let wrapper = e("#id-canvas-wrapper")
                        wrapper.style.height = self.canvas.height * zoom + "px"
                        wrapper.style.width = self.canvas.width * zoom + "px"
                        self.canvas.style.transform = `scale(${zoom})`
                    },
                },
            }
        ])

        // 更新图片快照
        sc.updateActiveImageSnapshot = function() {
            let raw = this.images[config.index.value]
            if (raw.dataset.type == 'default_blank') {
                e('.image-active > div > img').src = this.canvas.toDataURL("image/png")   
            }
        }

        // 上传图片需要刷新的配置
        // 每次上传图片都会调用
        sc.refreshConfig = function(tempImages) {
            log("refreshConfig")
            sc.getComponent('imageSelector').buildWith(tempImages)    
            config.index.max = self.images.length - 1
        }

        // 使用组件构建属性
        sc.getComponent('attribute').buildWith(self.imageControl.configAttribute())
    }

    /**
     * 注册鼠标移出画布事件
     */
    setupMouseleave() {
        let self = this       
        self.optimizer.resgisterMouse(function(event, action) {     
            if (action == 'mouseleave') {
                log('mouseleave canvas')
            }
        })
    }

    /**
     * 全局对象移动事件
     */
    setupMove() {
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
                    sc.getComponent('attribute').buildWith(self.imageControl.configAttribute())
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
    saveImage() {
        let points = this.penControl.points
        let texts = this.textControl.texts
        let shapes = this.shapeControl.shapes
        this.imageControl.saveImage(points, texts, shapes)
    }

    /**
     * 切换图片, 恢复图片的修改
     */
    switchImage(imageIndex) {
        let self = this
        let v = imageIndex
        config.index.value = v
        self.penControl.resetAndUpdate(self.imageControl.getImageChanges(v).points)
        self.textControl.resetAndUpdate(self.imageControl.getImageChanges(v).texts)
        self.shapeControl.resetAndUpdate(self.imageControl.getImageChanges(v).shapes)    
        // css
        removeClassAll('image-active')
        for (let block of es('.image-block')) {
            if (block.dataset.index == v) {
                block.classList.add('image-active')                                
            }
        }
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

    pointInShapes(x, y) {
        let inText = this.textControl.pointInText(x, y)
        let inShape = this.shapeControl.pointInShape(x, y)

        if (inText != null) {
            return inText
        }
        if (inShape != null) {
            return inShape
        }
        
        return null
    }

    pointInElement(x, y) {
        let inText = this.textControl.pointInText(x, y)
        let inShape = this.shapeControl.pointInShape(x, y)
        let dragger = this.pointInDraggers(x, y)
        if (dragger != null) {
            return dragger
        }
        if (inText != null) {
            return inText
        }
        if (inShape != null) {
            return inShape
        }
        
        return null
    }

    // -------- 全局属性组件 --------
    // 右边属性组件
    insertAttribute(attributeMap) {
        log("attributeMap", attributeMap)
        Array.from(es(".el-form-item")).forEach(element => {
            element.remove()
        });
        let form = e(".gen-attribute")
        for (let bindVar of Object.keys(attributeMap)) {
            // log("bindVar", bindVar)
            let attribute = attributeMap[bindVar]
            let html = this.template(bindVar, attribute)
            appendHtml(form, html)
        }
    }

    templateAttribute(bindVar, attribute) {
        var minAndMax = `
            max = ${attribute.max}
            min = ${attribute.min}
        `
        let t = `
        <div class="el-form-item el-form-item--small">
            <label class="el-form-item__label">${attribute._comment}</label>
            <div class="el-form-item__content">
            <div class="el-input el-input--small">
                <input 
                type="${attribute.type}" 
                data-value="${bindVar}" 
                value="${attribute.value}" 
                ${attribute.type == 'number' ? minAndMax : ''}
                autocomplete="off" class="gen-input el-input__inner"/>
            </div>
            </div>
        </div>
        `
        return t
    }

    // 左边栏的图片组件
    insertImageSelector(imageSnapshots) {
        log("imageSnapshots", imageSnapshots)
        let list = e(".image-list")
        let max = config.index.max
        for (let i = 0; i < imageSnapshots.length; i++) {
            let image = imageSnapshots[i]
            image.dataset.index = i + max + 1
            let html = this.template(image)
            appendHtml(list, html)
        }       
        //
        removeClassAll('image-active')
        for (let block of es('.image-block')) {
            let v = config.index.value
            if (block.dataset.index == v) {
                block.classList.add('image-active')
            }
        }
    }

    templateImageSelector(image) {
        let url = image.src
        let index = image.dataset.index
        let type = image.dataset.type
        let t = `
        <div class="block image-block" data-value="config.index" data-index="${index}" data-type="${type}">
            <div class="el-image" data-value="config.index" style="width: 100px; height: 100px;display: block;margin: auto;">
                <img src="${url}" data-value="config.index" class="el-image__inner" style="object-fit: scale-down;">
            </div>
            <div class="image-delete" data-value="action.delete">
                <i class="el-icon-delete" data-value="action.delete" style="margin: 5px;"></i>
            </div>
        </div>
        `
        return t
    }
}