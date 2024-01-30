import GenControls from "../gen_optimizer/gen_controls";
import Attribute from "../components/attribute";
import PanelSelector from "../components/panel_selector";
import {API_SERVER, config, persistedConfig, uploadConfig} from "../config/config";
import {
    ajax,
    base64ToBlob, bind,
    e,
    es,
    genRandomString,
    isBlank,
    log,
    parseBoolean,
    removeClassAll,
    removeClassAllWithCallback,
    scrollToBottom,
    sel,
    toggleClass
} from "../gen_optimizer/gen_utils";
import GenPoint from "../gen_optimizer/gen_point";
import GenText from "../gen_optimizer/gen_text";
import FileSaver from "file-saver"
import JSZip from "jszip"
import SettingDialog from "../components/setting_dialog";

export default class PageConfigControls extends GenControls {
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
        let panelWidth = 188
        let panelHeight = 100
        sc.bindComponent('panelSelector', PanelSelector.new(this, panelWidth, panelHeight))
        sc.bindComponent('settingDialog', SettingDialog.new(sc))

        // global document
        bind('#app', 'click', function (event) {
            sc.getComponent('panelSelector').handleGlobalClickEvent(event)
        })

        // 注册全局场景事件
        sc.registerGlobalEvents([
            // 左上按钮事件
            {
                eventName: "click",
                className: sc.pageClass.button,
                configToEvents: {
                    "config.preButton": function () {
                        // log("preButton", config.index.value)
                        if (config.index.value > 0) {
                            self.savePanel()
                            let v = config.index.value - 1
                            self.switchPanel(v)
                        }
                    },
                    "config.nextButton": function () {
                        // log("nextButton", config.index.value, self.images.length)
                        if (config.index.value < self.panels.length - 1) {
                            // 保存当前图片的修改
                            self.savePanel()
                            // 更新画笔和文字
                            let v = config.index.value + 1
                            self.switchPanel(v)
                        }
                    },
                    "config.penClearButton": function () {
                        // log("penClearButton")
                        self.penControl.resetAndUpdate([])
                        self.textControl.resetAndUpdate([])
                        self.shapeControl.resetAndUpdate([])
                        self.scene.message.success('清理成功')
                    },
                    "action.newBlank": function () {
                        let b = self.optimizer.defaultBlankPanel()
                        self.panels.push(b)
                        let tempPanels = []
                        tempPanels.push(b)
                        sc.getComponent('panelSelector').buildWith(tempPanels)
                        config.index.max = self.panels.length - 1
                        // switch to newBlank
                        self.shapeControl.removeDraggers()
                        self.savePanel()
                        let v = config.index.max
                        self.switchPanel(v)
                        scrollToBottom(e(sel(sc.pageClass.images)))
                        self.scene.message.success('新建成功')
                    },
                    "action.downloadImagesButton": async function () {
                        await self.downloadImages()
                    },
                    "action.loadFromClipboard": async function () {
                        try {
                            toggleClass(e("#id-loading-area"), "hide")
                            let clipboardItems = await navigator.clipboard.read()
                            let hasImage = false
                            clipboardItems.forEach(item => {
                                hasImage = item.types.filter(i => i.includes('image')).length > 0
                            })
                            if (!hasImage) {
                                toggleClass(e("#id-loading-area"), "hide")
                                sc.message.warning('请重试 剪贴板里没有图片')
                                return
                            }
                            for (let item of clipboardItems) {
                                for (let type of item.types.filter(i => i.includes('image'))) {
                                    let blob = await item.getType(type)
                                    if (blob.size > uploadConfig.max_size) {
                                        toggleClass(e("#id-loading-area"), "hide")
                                        sc.message.warning(`图片大小不能超过 ${uploadConfig.max_size_desc}`)
                                        break
                                    }
                                    const reader = new FileReader();
                                    reader.readAsDataURL(blob)
                                    reader.onload = function (event) {
                                        let img = new Image()
                                        img.src = event.target.result
                                        img.dataset.type = 'user_upload'
                                        img.onload = function () {
                                            self.optimizer.panels.push(img)
                                            sc && sc.refreshConfig([img])
                                            toggleClass(e("#id-loading-area"), "hide")
                                            setTimeout(() => {
                                                scrollToBottom(e(sel(sc.pageClass.images)))
                                            }, 100)
                                            self.scene.message.success('导入成功')
                                        }
                                    }
                                }
                            }
                        } catch (err) {
                            toggleClass(e("#id-loading-area"), "hide")
                            sc.message.error('从剪贴板导入图片失败')
                        }
                    },
                    "action.showCompressApiSetting": function () {
                        sc.getComponent('settingDialog').buildWith()
                    },
                },
            },
            // 右上角按钮事件
            {
                eventName: "click",
                className: sc.pageClass.drawer,
                before: function (bindVar, target) {
                    log("drawer", bindVar, target)
                    let shapeActive = sc.pageClass.shapeActive
                    removeClassAllWithCallback(shapeActive, (e) => {
                        let bindVar = e.dataset.value
                        // eval(bindVar + '.value=false')
                        config[bindVar.split('.')[1]].value = false
                    })
                    target.classList.add(shapeActive)
                    // eval(bindVar + '.value=' + parseBoolean(target.classList.contains(shapeActive)))
                    config[bindVar.split('.')[1]].value = parseBoolean(target.classList.contains(shapeActive))
                    self.shapeControl.removeDraggers()
                },
                configToEvents: {
                    "config.penEnabled": function (target) {
                        sc.getComponent('attribute').buildWith(GenPoint.defaultConfigAttribute())
                    },
                    "config.textInputEnabled": function (target) {
                        sc.getComponent('attribute').buildWith(GenText.defaultConfigAttribute())
                    },
                    "config.shapeEnabled": function (target) {
                        let shape = config.shapeSelect.value = target.dataset.shape
                        // 显示右边属性 
                        let att = self.shapeControl.shapeTypes[shape].defaultConfigAttribute()
                        sc.getComponent('attribute').buildWith(att)
                    },
                    "config.defaultPointerEnable": function (target) {
                        sc.getComponent('attribute').buildWith(self.panelControl.defaultConfigAttribute())
                    }
                }
            },
            {
                eventName: 'input',
                className: sc.pageClass.zoom,
                configToEvents: {
                    "action-zoom": function (target) {
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
                    "action-canvasHW": function (target) {
                        log("target", target, target.dataset.prop, target.value)
                        let prop = target.dataset.prop
                        if (prop == 'height') {
                            config.canvasHeight.value = self.parseValueWithType(target.value, 'number')
                        } else {
                            config.canvasWidth.value = self.parseValueWithType(target.value, 'number')
                        }
                    },
                }
            }
        ])

        // 更新图片快照
        sc.updateActivePanelSnapshot = function () {
            if (this.panels[config.index.value].dataset.type == 'default_blank' && this.canvas.width > 0 && this.canvas.height > 0) {
                let ps = sc.getComponent('panelSelector')
                let snapshot = e(`[data-index="${config.index.value}"] > div > canvas`)
                // let snapshot = e('.image-active > div > canvas')
                snapshot.width = ps.w
                snapshot.height = ps.h
                let ctx = snapshot.getContext('2d')
                ctx.drawImage(this.canvas, 0, 0, ps.w * ps.ratio, ps.h * ps.ratio)
            }
        }

        // 上传图片需要刷新的配置
        // 每次上传图片都会调用
        sc.refreshConfig = function (tempPanels) {
            log("refreshConfig")
            sc.getComponent('panelSelector').buildWith(tempPanels)
            let max = self.panels.length - 1
            config.index.max = max
            self.savePanel()
            self.switchPanel(max)
        }

        // 使用组件构建属性
        sc.getComponent('attribute').buildWith(self.panelControl.configAttribute())
    }

    async copyImage() {
        let self = this
        try {
            toggleClass(e("#id-loading-area"), "hide")
            self.shapeControl.removeDraggers()
            await self.optimizer.canvas.toBlob(function (blob) {
                const item = new ClipboardItem({"image/png": blob})
                navigator.clipboard.write([item])
                setTimeout(() => {
                    toggleClass(e("#id-loading-area"), "hide")
                    self.scene.message.success('复制成功')
                }, 200)
            })
        } catch (err) {
            toggleClass(e("#id-loading-area"), "hide")
            self.scene.message.error('复制失败' + err)
        }
    }

    async addToZip(canvas, zip, name) {
        return new Promise((resolve, reject) => {
            canvas.toBlob(function (blob) {
                let apiType = persistedConfig.API_TYPE.value
                let apiValue = persistedConfig.API_VALUE.value;
                if (apiType === 'default' || apiValue.length === 0) {
                    zip.file(name, blob)
                    resolve()
                    return
                }

                const formData = new FormData();
                formData.append('file', blob, name);
                formData.append('apiKey', apiValue);
                const header = {
                    "Access-Control-Allow-Origin": "*"
                }

                ajax('POST', API_SERVER + '/compressImg', formData, header, (r) => {
                    if (isBlank(r)) {
                        reject('Request Error.');
                    }
                    try {
                        let res = JSON.parse(r);
                        if (res.data == null) {
                            reject(res.error);
                        }
                        let imgBlob = base64ToBlob(res.data);
                        zip.file(name, imgBlob)
                        resolve()
                    } catch (error) {
                        reject('Request Error.');
                    }
                })
            })
        })
    }

    async downloadImages() {
        let self = this
        toggleClass(e("#id-loading-area"), "hide")
        e(".progress").style.width = "0%"
        let zip = new JSZip()
        let cur = config.index.value
        let len = self.panels.length
        for (let i = 0; i < len; i++) {
            try {
                self.shapeControl.removeDraggers()
                self.savePanel()
                self.switchPanel(i)
                self.optimizer.updateAndDraw()
                let idx = i + 1
                await self.addToZip(self.canvas, zip, idx + '.png')
                e(".progress").style.width = ((idx / len) * 100).toFixed(0) + "%"
            } catch (err) {
                self.savePanel()
                self.switchPanel(cur)
                toggleClass(e("#id-loading-area"), "hide")
                e(".progress").style.width = "0%"
                self.scene.message.error(err)
                return
            }
        }

        self.savePanel()
        self.switchPanel(cur)
        zip.generateAsync({type: 'blob'}, (metadata) => {
            e(".progress").style.width = metadata.percent.toFixed(0) + "%"
        }).then(function (content) {
            let name = "archive-" + genRandomString(5) + "-" + new Date().Format("MM-dd")
            FileSaver.saveAs(content, name)
            toggleClass(e("#id-loading-area"), "hide")
            e(".progress").style.width = "0%"
            self.scene.message.success('导出成功')
        })
    }

    setupUploadImageEvent() {
        let self = this
        let dp = this.canvas

        dp.addEventListener('dragover', function (e) {
            e.stopPropagation()
            e.preventDefault()
            e.dataTransfer.dropEffect = 'copy'
        })

        dp.addEventListener("drop", function (event) {
            let x = event.offsetX
            let y = event.offsetY
            event.stopPropagation()
            event.preventDefault()
            toggleClass(e("#id-loading-area"), "hide")
            let files = Object.values(event.dataTransfer.files).filter(
                f => f.type.includes("image")
            )
            let tempFiles = []
            for (let i = 0; i < files.length; i++) {
                let file = files[i]
                if (file.size > uploadConfig.max_size) {
                    toggleClass(e("#id-loading-area"), "hide")
                    self.scene.message.warning(`图片大小不能超过 ${uploadConfig.max_size_desc}`)
                    break
                }
                let reader = new FileReader()
                let offset = i * 20
                reader.readAsDataURL(file)
                reader.onload = function (event) {
                    let img = new Image()
                    img.src = event.target.result
                    img.dataset.type = 'user_upload'
                    img.onload = () => {
                        tempFiles.push(img)
                        self.shapeControl.handleImageEvent(img, x + offset, y + offset)
                        if (tempFiles.length == files.length) {
                            log("tempFiles", tempFiles, files)
                            toggleClass(e("#id-loading-area"), "hide")
                            self.scene.message.success('导入成功')
                        }
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
        self.optimizer.resgisterMouse(function (event, action) {
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
        self.optimizer.resgisterMouse(function (event, action) {
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
                // 点击到空白的地方, 并且所以 text 是 idle 状态
                if (element == null && self.shapeControl.allTextIdled()) {
                    log("点击到空白的地方")
                    sc.getComponent('attribute').buildWith(self.panelControl.configAttribute())
                    self.shapeControl.removeDraggers()
                    self.textControl.handleTextEvents(event, x, y)
                } else {
                    self.shapeControl.removeDraggers()
                    element?.activateDraggers()
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
        self.optimizer.resgisterMouse(function (event, action) {
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
        if (img.dataset.type == "user_upload") {
            ratio = 1
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
    }

    movePanel(from, to) {
        if (from === to) {
            return
        }

        let self = this
        let temp = self.optimizer.panels[from];
        self.optimizer.panels.splice(from, 1)
        self.optimizer.panels.splice(to, 0, temp)

        let tempSnapshot = self.optimizer.panelSnapshots[from];
        self.optimizer.panelSnapshots.splice(from, 1)
        self.optimizer.panelSnapshots.splice(to, 0, tempSnapshot)

        let tempImageChanges = self.panelControl.imageChanges[from]
        self.panelControl.imageChanges.splice(from, 1)
        self.panelControl.imageChanges.splice(to, 0, tempImageChanges)
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