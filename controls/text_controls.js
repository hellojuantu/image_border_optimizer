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
                log("targetText", targetText)
                self.insertInput(GenText.new(self.scene, targetText.text, self.textX, self.textY))
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
        self.insertInput(GenText.new(self.scene, '', x, y))
        // update offset
        self.textX = x
        self.textY = y
    }

    updateFloatTextPosition(zoom) {
        let self = this
        let selector = "#" + self.inputId
        let input = e(selector)
        if (input == null) {
            return
        }
        let x = input.dataset.x
        let y = input.dataset.y
        let pos = self.canvasToPage(x, y)
        input.style.left = pos.x - 1 + 'px'
        input.style.top = pos.y - 1 + 'px'
        input.style.font = self.fixFont(input.dataset.font)
        input.style.lineHeight = calHeightLine(input.dataset.value, input.dataset.font, zoom) + "px"
    }

    insertInput(text) {
        // gx, gy, font, color, value=''
        let self = this
        // 坐标转换
        let pos = self.canvasToPage(text.x, text.y)
        let gx = pos.x
        let gy = pos.y
        let font = text.font
        let color = text.color
        let value = text.text
        //
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
        input.dataset.x = text.x
        input.dataset.y = text.y
        input.dataset.font = font
        let zoom = config.zoom.value / 100
        input.style.display = "inline"
        input.style.left = gx - 1 + "px"
        input.style.top = gy - 1 + "px"
        input.style.font = self.fixFont(font)
        input.style.color = color
        input.style.lineHeight = calHeightLine(value, font, zoom) + "px"
        // focus
        input.focus()
        selectAll(self.inputId)        
    
        input.addEventListener('keypress', function(event) {
            // enter keycode is 13
            if (event.keyCode == 13 && event.shiftKey == false) {
                event.preventDefault()
                document.execCommand("insertLineBreak")
            } 
        })

        bind(selector, 'input', function(event) {           
            let target = event.target
            let text = target.innerText
            target.dataset.value = text
        })

        bind(selector, 'paste', async function(event) {
            // 过滤 html 标签
            event.preventDefault()
            let text = (event.originalEvent || event).clipboardData.getData('text/plain')
            document.execCommand("insertText", false, text)
        })
    }
    
    closeInputAndAddText() {
        let self = this
        let closeInput = self.closeInput()
        let htmlText = closeInput.innerHTML
        let textContent = closeInput.dataset.value
        log("textContent", textContent)
        if (textContent.trim().length <= 0) {
            return
        }
        self.addText(textContent, self.textX, self.textY, htmlText)
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

    addText(content, x, y, html) {
        let text = GenText.new(this.scene, content, x, y, html)
        // text.fillProp(prop)
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
        log("zoom", zoom)
        let size = this.parseValueWithType(font.split(' ')[0].replace('px', ''), 'number') * zoom
        let family = font.split(' ')[1]
        return `${size}px ${family}`
    }
}