class TextControls extends GenControls {
    constructor(scene) {
        super(scene)
        this.setup()
    }

    static new(...args) {
        return new this(...args)
    }

    setup() {
        this.texts = []
        // 字体拖拽
        this.setupMove()
        // 字体输入
        this.setupInput()
        // 双击编辑文字
        this.setupChangeText()
    }

    setupMove() {
        let self = this
        let startDrag = false
        let ox = 0
        let oy = 0

        // 全局拖拽文字的 uuid, 避免多个文字同时拖拽
        this.textUUID = null

        self.optimizer.resgisterMouse(function(event, action) {
            if (parseBoolean(config.penEnabled.value)) {
                return
            }
            let x = event.offsetX
            let y = event.offsetY
            let targetText = self.pointInText(x, y).filter(function(e) {
                if (self.textUUID == null) {
                    return true
                } else {
                    return e.id == self.textUUID
                }
            }).pop()
            if (action == 'down') {
                if (targetText != null && self.textUUID == null) {
                    startDrag = true
                    ox = targetText.x - x
                    oy = targetText.y - y
                    self.textUUID = targetText.id
                }
            } else if (action == 'move') {
                if (startDrag && targetText != null && targetText.id == self.textUUID) {
                    targetText.x = x + ox
                    targetText.y = y + oy   
                    targetText.dragged = true 
                    self.textUUID = targetText.id
                }   
            } else if (action == 'up') {
                startDrag = false
                if (targetText != null && targetText.id == self.textUUID) {
                    targetText.dragged = false
                    self.textUUID = null
                }
            }
        })
    }

    setupInput() {
        let self = this
        self.inputOpen = false
        self.inputId = "id-text"
        // 从 input 中获取 文字的 x, y
        self.textX = 0
        self.textY = 0
        
        self.optimizer.resgisterMouse(function(event, action) {
            event.preventDefault()
            if (parseBoolean(config.penEnabled.value) || 
                !parseBoolean(config.textInputEnabled.value)) {
                return
            }
            let x = event.offsetX
            let y = event.offsetY
            let targetText = self.pointInText(x, y).pop()
            if (targetText != null) {
                return
            }
            // add edit text
            if (action == 'down') {
                if (self.inputOpen) {
                    // close input
                    let closeInput = self.closeInput()
                    let textContent = closeInput.value
                    if (textContent.trim().length <= 0) {
                        return
                    }
                    self.addText(textContent, self.textX, self.textY)
                } else {
                    // open input
                    let p = self.canvasToPage(x, y)
                    self.insertInput(p.x, p.y , config.textFont.value, config.textFontColor.value)
                    // update offset
                    self.textX = x
                    self.textY = y
                }
            }
        })
    }

    setupChangeText() {
        let self = this
        self.optimizer.resgisterMouse(function(event, action) {
            if (parseBoolean(config.penEnabled.value) || 
                !parseBoolean(config.textInputEnabled.value)) {
                return
            }
            let x = event.offsetX
            let y = event.offsetY
            let targetText = self.pointInText(x, y).pop()
            // input open annd click text
            if (targetText != null && self.inputOpen) {
                // close input
                let textContent = self.closeInput().value
                if (textContent.trim().length <= 0) {
                    return
                }
                self.addText(textContent, self.textX, self.textY)
                return
            }
            // 双击编辑文字
            if (targetText != null && action == 'dblclick') {
                // 关闭之前的 input
                self.closeInput()
                // 保存文字的坐标, 关闭 input 时, 添加文字到对应坐标
                self.textX = targetText.x
                self.textY = targetText.y
                // 打开 input
                let p = self.canvasToPage(self.textX, self.textY)
                self.insertInput(p.x, p.y, targetText.font, targetText.color, targetText.text)
                // 删除文字
                targetText.deleted = true
                return
            }
        })
    }

    insertInput(gx, gy, font, color, value='') {
        this.inputOpen = true
        //
        let selector = "#" + this.inputId
        if (e(selector) != null) {
            return
        }
        let div = document.createElement('div');
        div.innerHTML = `<input autofocus="autofocus" cols="30" value="${value}" type="text" id="${this.inputId}" class="float-input-text">`
        e("#id-canvas-area").append(div)
        // 添加样式
        let input = e(selector)
        input.style.display = "block"
        input.style.left = gx + "px"
        input.style.top = gy + "px"
        input.style.font = font
        input.style.color = color
        input.focus()
    }

    closeInput() {
        this.inputOpen = false
        //
        let selector = "#" + this.inputId
        let inputFloat = e(selector)
        if (inputFloat != null) {
            inputFloat.closest('div').remove()
        }
        return inputFloat
    }

    pointInText(x, y) {
        let clickedTexts = []
        for (let text of this.texts) {
            if (text.pointInFrame(x, y) && !text.deleted) {
                clickedTexts.push(text)
            }
        }
        return clickedTexts
    }

    addText(content, x, y) {
        this.texts.push(GenText.new(this.scene, content, x, y))
    }

    draw() {
        let self = this
        // 过滤 texts 里面的被删除的文字
        self.texts = self.texts.filter((t) => !t.deleted)
        for (let text of self.texts) {
            text.draw()
        }
    }
}