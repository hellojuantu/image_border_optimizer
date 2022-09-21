class PageControls extends GenControls {
    constructor(scene, imageControl, pen, textControl) {
        super(scene)
        this.imageControl = imageControl
        this.pen = pen
        this.textControl = textControl
        this.setup()
    }

    setup() {
        let self = this
        let sc = self.scene
        
        // 添加页面 class, 并绑定模板生成页面
        sc.registerPageClass({
            "controls": 'gen-controls',
            "slider": 'gen-auto-slider',
            "button": 'gen-auto-button',
        }).bindTemplate(self.templateControls)

        // 注册场景事件
        sc.registerSceneEvents({
            input: {
                pageClass: sc.pageClass.slider,
                callback: function(bindVar, target) {
                    var v = target.value
                    sc.updateControls(bindVar + '.value', v)
                },
            },
            click: {
                pageClass: sc.pageClass.button,
            }
        })
        
        // 绑定事件
        sc.bindEvents({
            input: {
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
            },
            click: {
                "config.preButton": function(target) {
                    if (config.index.value > 0) {
                        self.saveImage()
                        var v = config.index.value - 1
                        sc.updateControls("config.index.value", v)
                        self.pen.resetAndUpdate(self.imageControl.imageChanges[v].points)
                        self.textControl.resetAndUpdate(self.imageControl.imageChanges[v].texts)
                    }
                },
                "config.nextButton": function(target) {
                    if (config.index.value < self.images.length - 1) {
                        // 保存当前图片的修改
                        self.saveImage()
                        var v = config.index.value + 1
                        sc.updateControls("config.index.value", v)
                        // 更新画笔和文字
                        self.pen.resetAndUpdate(self.imageControl.imageChanges[v].points)
                        self.textControl.resetAndUpdate(self.imageControl.imageChanges[v].texts)
                    }
                },
                "config.centerButton": function(target) {
                    var w = self.canvas.width
                    var img = self.images[config.index.value]
                    var imgW = img.width
                    sc.updateControls('config.imageOffset.value', (w - imgW) / 2)
                },
                "config.penClearButton": function(target) {
                    self.pen.resetAndUpdate([])
                },
            },
        })

        // 上传图片需要刷新的配置
        sc.refreshConfig = function() {
            // log("refreshConfig", this.images.length)
            sc.updateControls("config.index.max", this.images.length - 1)
        }

    }

    // 保存图片的修改
    saveImage() {
        let points = this.pen.points
        let texts = this.textControl.texts
        this.imageControl.saveImage(points, texts)
    }

    templateControls(scene, key, item) {
        let sliderClass = scene.pageClass.slider
        let buttonClass = scene.pageClass.button
        var minAndMax = `
            max = ${item.max}
            min = ${item.min}
        `
        var inputAndRange = `
            <input class='${sliderClass}' type="${item.type}"
                value="${item.value}"
                ${item.type == 'range' ? minAndMax : ''}
                data-value="config.${key}"
                data-type="${item.type}"
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
                </label>
            </div>
        `
        return t
    }
}