class PageConfigControls extends GenControls {
    constructor(scene, imageControl, penControl, textControl, shapeControl) {
        super(scene)
        this.imageControl = imageControl
        this.penControl = penControl
        this.textControl = textControl
        this.shapeControl = shapeControl
        this.setup()
        this.setupCorsorEevnt()
        this.setupMove()
        this.setupDrawShape()
    }

    setup() {
        let self = this
        let sc = self.scene
        
        // 注册页面 class 并构建页面
        sc.registerPageClass({
            "controls": 'gen-controls',
            "slider": 'gen-auto-slider',
            "button": 'gen-auto-button',
            "lable": 'gen-label',
            "canvas": 'canvas-area',
            "body": 'body-area',
        }).buildPage(self.insertControls())

        // 注册场景全局事件
        sc.registerGlobalEvents([            
            {
                eventName: "input",
                className: sc.pageClass.slider,
                callback: function(bindVar, target) {
                    var v = target.value
                    self.updateControls(bindVar + '.value', v)
                },
                configToEvents: {
                    "config.textFont": function(target) {
                        if (self.textControl.inputOpen) {
                            let sel = "#" + self.textControl.inputId
                            let input = e(sel)
                            input.style.font = target.value
                        }
                    },
                    "config.textColor": function(target) {
                        if (self.textControl.inputOpen) {
                            let sel = "#" + self.textControl.inputId
                            let input = e(sel)
                            input.style.color = target.value
                        }
                    },
                }
            },
            {
                eventName: "click",
                className: sc.pageClass.button,
                configToEvents: {
                    "config.preButton": function(target) {
                        if (config.index.value > 0) {
                            self.saveImage()
                            var v = config.index.value - 1
                            self.updateControls("config.index.value", v)
                            self.penControl.resetAndUpdate(self.imageControl.imageChanges[v].points)
                            self.textControl.resetAndUpdate(self.imageControl.imageChanges[v].texts)
                            self.shapeControl.resetAndUpdate(self.imageControl.imageChanges[v].shapes)
                        }
                    },
                    "config.nextButton": function(target) {
                        if (config.index.value < self.images.length - 1) {
                            // 保存当前图片的修改
                            self.saveImage()
                            var v = config.index.value + 1
                            self.updateControls("config.index.value", v)
                            // 更新画笔和文字
                            self.penControl.resetAndUpdate(self.imageControl.imageChanges[v].points)
                            self.textControl.resetAndUpdate(self.imageControl.imageChanges[v].texts)
                            self.shapeControl.resetAndUpdate(self.imageControl.imageChanges[v].shapes)
                        }
                    },
                    "config.centerButton": function(target) {
                        var w = self.canvas.width
                        var img = self.images[config.index.value]
                        var imgW = img.width
                        self.updateControls('config.imageOffset.value', (w - imgW) / 2)
                    },
                    "config.penClearButton": function(target) {
                        self.penControl.resetAndUpdate([])
                    },
                },
            },            
            {
                eventName: "click",
                className: sc.pageClass.canvas,
                callback: function(bindVar, target) {
                    log("canvas")
                    // 点击 canvas 让 slider 全部 blur
                    Array.from(es(sel(sc.pageClass.slider))).forEach(function(e) {
                        e.blur()
                    })
                },
            },
            {
                eventName: "click",
                className: sc.pageClass.slider,
                configToEvents: {
                    "config.shapeSelect": function(target) {
                        log("click")
                        self.updateControls("config.shapeSelect.value", '')
                    },
                }
            },
        ])

        // 上传图片需要刷新的配置
        sc.refreshConfig = function() {
            self.updateControls("config.index.max", this.images.length - 1)
        }
    }

    setupMove() {
        let self = this
        let ox = 0
        let oy = 0
        let draggedShape = null
        self.optimizer.resgisterMouse(function(event, action) {            
            let x = event.offsetX
            let y = event.offsetY
            let targetShape = self.pointInElement(x, y)
            // log("targetShape", targetShape, self.shapes, action)
            if (action == 'down') {
                if (targetShape != null && !targetShape.isCreating()) {
                    draggedShape = targetShape
                    ox = draggedShape.x - x
                    oy = draggedShape.y - y     
                    draggedShape.selected()
                }
            } else if (action == 'move') {
                if (draggedShape != null && draggedShape.isSelected()) {
                    draggedShape.x = x + ox
                    draggedShape.y = y + oy
                }
            } else if (action == 'up') {
                if (draggedShape != null) {
                    draggedShape = null
                }                
            } 
        })
    }

    setupCorsorEevnt() {
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
                if (element != null && element.status != element.enumStatus.creating) {
                    self.optimizer.setCursor('move')
                } else {
                    self.optimizer.setCursor('default')
                }
            } else if (action == 'down') {
                // element 创建的不符合要求会被删除
                if (element != null && element.isDeleted()) {
                    element == null
                }
                // 点击到空白的地方
                if (element == null) {
                    self.shapeControl.removeDraggers()  
                    self.textControl.handleTextEvents(event, x, y)
                } else {
                    self.shapeControl.removeDraggers()
                    element.activateDraggers()
                }
            }
        })

        // self.optimizer.resgisterMouse(function(event, action) {
        //     if (parseBoolean(config.penEnabled.value)) {
        //         return
        //     }
        //     let x = event.offsetX
        //     let y = event.offsetY
        //     let element = self.pointInDraggers(x, y)
        //     if (action == 'overmove') {
        //         if (element != null) {
        //             self.optimizer.setCursor(element.cursor)
        //         } else {
        //             self.optimizer.setCursor('default')
        //         }
        //     }
        // })
    }

    pointInDraggers(x, y) {
        for (let dragger of this.shapeControl.allDraggers()) {
            if (dragger.pointInFrame(x, y)) {
                return dragger
            }
        }
        return null
    }

    setupDrawShape() {
        let self = this
        self.optimizer.resgisterMouse(function(event, action) {
            let x = event.offsetX
            let y = event.offsetY            
            let targetShape = self.pointInElement(x, y)
            self.shapeControl.handleShapeEvent(action, x, y, targetShape)
        })
    }

    pointInElement(x, y) {
        let inText = this.textControl.pointInText(x, y)
        let inShape = this.shapeControl.pointInShape(x, y)
        // let dragger = this.pointInDraggers(x, y)
        // if (dragger != null) {
        //     return dragger
        // }
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

    insertControls() {
        let self = this
        let sc = self.scene
        var div = e(sel(sc.pageClass.controls))
        var keys = Object.keys(config)
        for (var k of keys) {
            var item = config[k]
            var html = self.templateControls(k, item)
            appendHtml(div, html)
        }
    }

    templateControls(key, item) {
        let self = this
        let sc = self.scene
        let sliderClass = sc.pageClass.slider
        let buttonClass = sc.pageClass.button
        var minAndMax = `
            max = ${item.max}
            min = ${item.min}
        `
        let hasList = item.list != null
        let list = ``
        if (hasList) {
            list = `
                <datalist id="${item.list.name}">
                    ${item.list.options.map(v => `<option value="${v}">${v}</option>`).join("")}}
                </datalist>
            `
        }
        var inputAndRange = `
            <input class='${sliderClass}' type="${item.type}"
                value="${item.value}"
                ${item.type == 'range' ? minAndMax : ''}
                data-value="config.${key}"
                data-type="${item.type}"
                ${hasList ? `list="${item.list.name}"` : ''}
                >
            ${item._comment}: <span class="gen-label">${item.value}</span>
        `
        var button = `
            <div class="gen-controller">
                <label>
                    <button class='${buttonClass}' data-type="${item.type}" data-value="config.${key}">${item._comment}</button>
                </label>
            </div>
        `        
        var t = `
            <div class="gen-controller">
                <label>
                    ${item.type == 'button' ? button : inputAndRange}
                    ${hasList ? list : ''}
                </label>
            </div>
        `
        return t
    }

}