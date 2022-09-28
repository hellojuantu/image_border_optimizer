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
        })

        // 绑定组件, 全局可用
        sc.bindComponent('attribute', {
            'template': self.templateAttribute,
            'builder': self.insertAttribute,
        })

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
                            input.style.font = target.value
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
                    "config.index": function(target) {
                        self.saveImage()
                        //
                        let i = parseInt(target.value)
                        self.penControl.resetAndUpdate(self.imageControl.imageChanges[i].points)
                        self.textControl.resetAndUpdate(self.imageControl.imageChanges[i].texts)
                        self.shapeControl.resetAndUpdate(self.imageControl.imageChanges[i].shapes)
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
                            config.index.value = v
                            self.penControl.resetAndUpdate(self.imageControl.imageChanges[v].points)
                            self.textControl.resetAndUpdate(self.imageControl.imageChanges[v].texts)
                            self.shapeControl.resetAndUpdate(self.imageControl.imageChanges[v].shapes)
                        }
                    },
                    "config.nextButton": function(target) {
                        // log("nextButton", config.index.value, self.images.length)
                        if (config.index.value < self.images.length - 1) {
                            // 保存当前图片的修改
                            self.saveImage()
                            var v = config.index.value + 1
                            config.index.value = v
                            // 更新画笔和文字
                            self.penControl.resetAndUpdate(self.imageControl.imageChanges[v].points)
                            self.textControl.resetAndUpdate(self.imageControl.imageChanges[v].texts)
                            self.shapeControl.resetAndUpdate(self.imageControl.imageChanges[v].shapes)
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
                        log("TODO copyImageButton")
                    },
                },
            },            
            // 右上角按钮事件
            {
                eventName: "click",
                className: sc.pageClass.drawer,
                before: function(bindVar, target) {
                    let shapeActive = 'shape-active'
                    if (target.classList.contains(shapeActive)) {
                        target.classList.remove(shapeActive)
                        // sc.getComponent('attribute').builder(self.imageControl.configAttribute())
                    } else {
                        removeClassAllWithCallback(shapeActive, (e) => {
                            let bindVar = e.dataset.value
                            eval(bindVar + '.value=false')
                        }) 
                        target.classList.add(shapeActive)
                    }
                    eval(bindVar + '.value=' + parseBoolean(target.classList.contains('shape-active')))
                },
                configToEvents: {                    
                    "config.penEnabled": function(target) {
                        log("penEnabled")      
                        // 显示右边属性    
                        sc.getComponent('attribute').builder(GenPoint.configAttribute())
                    },
                    "config.textInputEnabled": function(target) {
                        log("textInputEnabled")
                        // 显示右边属性  
                        sc.getComponent('attribute').builder(GenText.configAttribute())                
                    },
                    "config.shapeEnabled": function(target) {
                        log("shapeEnabled", target, target.dataset)  
                        let shape = config.shapeSelect.value = target.dataset.shape                                                         
                        // 显示右边属性 
                        let att = self.shapeControl.shapeTypes[shape].configAttribute()
                        sc.getComponent('attribute').builder(att)
                    },                   
                }
            }
        ])

        // 上传图片需要刷新的配置
        // 每次上传图片都会调用
        sc.refreshConfig = function() {
            log("refreshConfig")
            self.updateControls("config.index.max", this.images.length - 1)
        }

        // 使用组件构建属性
        sc.getComponent('attribute').builder(self.imageControl.configAttribute())
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
                    sc.getComponent('attribute').builder(attributeMap)
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

            self.shapeControl.handleShapeEvent(action, x, y, element)

            if (action == 'up') {
                // element 创建的不符合要求会被删除
                if (element != null && element.isDeleted()) {
                    element = null
                }
                // 点击到空白的地方
                if (element == null) {
                    log("点击到空白的地方")
                    sc.getComponent('attribute').builder(self.imageControl.configAttribute())
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

    // 保存图片的修改
    saveImage() {
        let points = this.penControl.points
        let texts = this.textControl.texts
        let shapes = this.shapeControl.shapes
        this.imageControl.saveImage(points, texts, shapes)
    }

    // insertControls() {
    //     let self = this
    //     let sc = self.scene
    //     var div = e(sel(sc.pageClass.controls))
    //     var keys = Object.keys(config)
    //     for (var k of keys) {
    //         var item = config[k]
    //         if (item.type == 'button') {
    //             continue
    //         }
    //         // var html = self.templateControls(k, item)
    //         // appendHtml(div, html)
    //     }
    // }

    // templateControls(key, item) {
    //     let self = this
    //     let sc = self.scene
    //     let sliderClass = sc.pageClass.slider
    //     let buttonClass = sc.pageClass.button
    //     var minAndMax = `
    //         max = ${item.max}
    //         min = ${item.min}
    //     `
    //     let hasList = item.list != null
    //     let list = ``
    //     if (hasList) {
    //         list = `
    //             <datalist id="${item.list.name}">
    //                 ${item.list.options.map(v => `<option value="${v}">${v}</option>`).join("")}}
    //             </datalist>
    //         `
    //     }
    //     var inputAndRange = `
    //         <input class='${sliderClass}' type="${item.type}"
    //             value="${item.value}"
    //             ${item.type == 'range' ? minAndMax : ''}
    //             data-value="config.${key}"
    //             data-type="${item.type}"
    //             ${hasList ? `list="${item.list.name}"` : ''}
    //             >
    //         ${item._comment}: <span class="gen-label">${item.value}</span>
    //     `
    //     var button = `
    //         <div class="gen-controller">
    //             <label>
    //                 <button class='${buttonClass}' data-type="${item.type}" data-value="config.${key}">${item._comment}</button>
    //             </label>
    //         </div>
    //     `        
    //     var t = `
    //         <div class="gen-controller">
    //             <label>
    //                 ${item.type == 'button' ? button : inputAndRange}
    //                 ${hasList ? list : ''}
    //             </label>
    //         </div>
    //     `
    //     return t
    // }

    insertAttribute(attributeMap) {
        log("attributeMap", attributeMap)
        Array.from(es(".el-form-item")).forEach(element => {
            element.remove()
        });
        let form = e(".gen-attribute")
        for (let bindVar of Object.keys(attributeMap)) {
            log("bindVar", bindVar)
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

}