class PageConfigControls extends GenControls {
    constructor(scene, imageControl, penControl, textControl) {
        super(scene)
        this.imageControl = imageControl
        this.penControl = penControl
        this.textControl = textControl
        this.setup()
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
        }).buildPage(self.insertControls())

        // 注册场景事件
        sc.registerSceneEvents({
            [sc.pageClass.slider]: {
                eventName: "input",
                callback: function(bindVar, target) {
                    var v = target.value
                    self.updateControls(bindVar + '.value', v)
                },
            },
            [sc.pageClass.button]: {
                eventName: "click",
            }
        })
       
        // 给场景绑定 配置事件
        sc.bindConfigEvents({
            [sc.pageClass.slider]: {
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
            [sc.pageClass.button]: {
                "config.preButton": function(target) {
                    if (config.index.value > 0) {
                        self.saveImage()
                        var v = config.index.value - 1
                        self.updateControls("config.index.value", v)
                        self.penControl.resetAndUpdate(self.imageControl.imageChanges[v].points)
                        self.textControl.resetAndUpdate(self.imageControl.imageChanges[v].texts)
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
        })

        // 上传图片需要刷新的配置
        sc.refreshConfig = function() {
            self.updateControls("config.index.max", this.images.length - 1)
        }
    }

    // 保存图片的修改
    saveImage() {
        let points = this.penControl.points
        let texts = this.textControl.texts
        this.imageControl.saveImage(points, texts)
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