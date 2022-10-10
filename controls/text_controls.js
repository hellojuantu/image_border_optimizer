class TextControls extends GenControls {
    constructor(scene, shapeControl) {
        super(scene)
        this.scene = scene
        this.shapeControl = shapeControl
        this.setup()
    }

    setup() {
        this.texts = []
        // 字体输入
        this.setupInput()
        // 双击编辑文字
        this.setupChangeText()
    }

    setupInput() {
        let self = this
        self.inputOpen = false
        self.inputId = "id-text"
        // 从 input 中获取 文字的 x, y
        self.textX = 0
        self.textY = 0
    }

    handleTextEvents(event, x, y) {
        event.preventDefault()
        let self = this
        let sc = self.scene
        if (parseBoolean(config.penEnabled.value)) {
            return
        }
        log('input', self.inputOpen)
        if (self.inputOpen) {
            self.closeInputAndAddText()
        } else {
            if (parseBoolean(config.textInputEnabled.value)) {
                self.addFloatInput(x, y)
                sc.getComponent('attribute').buildWith(GenText.configAttribute())                
            }
        } 
    }

    setupChangeText() {
        let self = this
        self.optimizer.resgisterMouse(function(event, action) {
            if (parseBoolean(config.penEnabled.value)) {
                return
            }
            let x = event.offsetX
            let y = event.offsetY
            let targetText = self.pointInText(x, y)
            // input open and click text
            if (targetText != null && self.inputOpen) {
                // close input
                self.closeInputAndAddText()
                return
            }
            // 双击编辑文字
            if (targetText != null && action == 'dblclick') {
                self.optimizer.setCursor('default')
                // 关闭之前的 input
                self.closeInput()
                // 保存文字的坐标, 关闭 input 时, 添加文字到对应坐标
                self.textX = targetText.x
                self.textY = targetText.y
                // 打开 input
                let p = self.canvasToPage(self.textX, self.textY)
                log("targetText", targetText)
                self.insertInput(p.x, p.y, targetText.font, targetText.color, targetText.text)
                // 设置字体属性到配置栏
                self.updateControls("config.textFont.value", targetText.font)
                self.updateControls("config.textColor.value", targetText.color)
                // 删除文字
                targetText.deleted()
                return
            }
        })
    }

    addFloatInput(x, y) {
        let self = this
        let p = self.canvasToPage(x, y)
        self.insertInput(p.x, p.y, config.textFont.value, config.textColor.value, '', 20)
        // update offset
        self.textX = x
        self.textY = y
    }

    insertInput(gx, gy, font, color, value='', defaultWith=0) {
        let self = this
        self.inputOpen = true
        //
        let selector = "#" + self.inputId
        if (e(selector) != null) {
            return
        }
        let div = document.createElement('div');
        div.innerHTML = `<span contenteditable="true" id="${this.inputId}" class="float-input-text"></span>`
        e("#id-canvas-area").append(div)
        // 添加样式
        let input = e(selector)
        input.innerText = value
        input.dataset.value = value
        let zoom = self.parseValueWithType(e(".zoom-input").value, 'number') / 100
        input.style.display = "block"
        input.style.left = gx - 1 + "px"
        input.style.top = gy - 1 + "px"
        input.style.font = self.fixFont(font)
        input.style.color = color

        let lines = value.split('\n')
        let max = lines[0]
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i]
            if (!isBlank(line) && line.length > max.length) {
                max = line
            }
        }
        let p = calTextWH(max, font)
        input.style.lineHeight = p.h * zoom + "px"
        // input.cols = calCols(max)
        // input.rows = getRows(value, p.w, font).length
        // input.style.height = p.h * getRows(value, p.w, font).length + 'px'
        input.focus()
        // input.select()
        // 输入时, 自动更新宽度
        bind(selector, 'input', function(event) {           
            let target = event.target
            // let value = target.dataset.value
            target.dataset.value = target.innerText
            // let font = target.style.font

            // let lines = value.split('\n')
            // let max = lines[0]
            // for (let i = 0; i < lines.length; i++) {
            //     let line = lines[i]
            //     if (!isBlank(line) && line.length > max.length) {
            //         max = line
            //     }
            // }
            // let p = calTextWH(max, font)
            // log("p", p)
            // target.style.width = p.w * zoom + 'px'
            // target.style.height = p.h * getRows(value, p.w, font).length + 'px'

            // target.cols = calCols(max)
            // target.rows = getRows(value, p.w, font).length
        })
    }

    closeInputAndAddText() {
        let self = this
        let closeInput = self.closeInput()
        let textContent = closeInput.dataset.value
        log("textContent", textContent)
        if (textContent.trim().length <= 0) {
            return
        }
        self.addText(textContent, self.textX, self.textY, closeInput.style.font, closeInput.style.color)
    }

    closeInput() {
        this.inputOpen = false
        //
        let selector = "#" + this.inputId
        let inputFloat = e(selector)
        if (inputFloat != null && inputFloat.closest('div') != null) {
            inputFloat.closest('div').remove()
        }
        return inputFloat
    }

    removeFloatInputText() {
        let selector = "#" + this.inputId
        let inputFloat = e(selector)
        if (inputFloat != null) {
            inputFloat.closest('div').remove()
        }
        return inputFloat
    }
    
    pointInText(x, y) {
        for (let text of this.texts) {
            if (text.pointInFrame(x, y) && !text.isDeleted()) {
                return text
            }
        }
        return null
    }

    addText(content, x, y, prop={}) {
        let text = GenText.new(this.scene, content, x, y)
        text.fillProp(prop)
        text.idle()                
        this.shapeControl.shapes.unshift(text)
        this.texts.unshift(text)
    }

    resetAndUpdate(texts) {
        this.texts = texts
    }

    /**
     * 修正显示的字体大小
     */
    fixFont(font) {
        font = font.trim()
        let zoom = config.zoom.value / 100
        let size = this.parseValueWithType(font.split(' ')[0].replace('px', ''), 'number') * zoom
        let family = font.split(' ')[1]
        return `${size}px ${family}`
    }

    // draw() {
    //     let self = this
    //     // 过滤 texts 里面的被删除的文字
    //     self.texts = self.texts.filter((t) => !t.isDeleted())
    //     // 倒着遍历
    //     for (let i = self.texts.length - 1; i >= 0; i--) {
    //         let text = self.texts[i]
    //         text.draw()
    //     }
    // }
}