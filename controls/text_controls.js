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
        // 字体移动
        this.setupMove()
        // 字体输入
        this.setupInput()
    }

    setupMove() {
        let self = this
        let startDrag = false
        let ox = 0
        let oy = 0

        self.optimizer.resgisterMouse(function(event, action) {
            let x = event.offsetX
            let y = event.offsetY
            let targetText = self.pointInText(x, y)
            if (parseBoolean(config.penEnabled.value)) {
                return
            }
            if (action == 'down') {
                if (targetText != null) {
                    startDrag = true
                    ox = targetText.x - x
                    oy = targetText.y - y
                }
            } else if (action == 'move') {
                if (startDrag && targetText != null) {
                    targetText.x = x + ox
                    targetText.y = y + oy   
                    targetText.dragged = true 
                }   
            } else if (action == 'up') {
                startDrag = false
                if (targetText != null) {
                    targetText.dragged = false
                }
            }
        })
    }

    setupInput() {
        let self = this
        let inputOpen = false
        // 从 input 中获取 文字的 x, y
        let textX = 0
        let textY = 0
        
        self.optimizer.resgisterMouse(function(event, action) {
            event.preventDefault()
            if (!parseBoolean(config.textInputEnabled.value)) {
                return
            }
            let x = event.offsetX
            let y = event.offsetY
            let targetText = self.pointInText(x, y)
            if (targetText != null) {
                return
            }
            // add edit text
            if (action == 'down') {
                if (inputOpen) {
                    inputOpen = false
                    // close input
                    let inputFloat = e("#id-text") 
                    let textContent = inputFloat.value
                    inputFloat.closest('div').remove()
                    self.addText(textContent, textX, textY)
                } else {
                    inputOpen = true
                    // open input
                    let box = self.canvas.getBoundingClientRect()
                    let gx = x + box.left
                    let gy = y + box.top
                    self.insertInput(gx, gy)
                    // update offset
                    textX = event.offsetX
                    textY = event.offsetY
                }
            }
        })
    }

    insertInput(gx, gy) {
        let text = e("#id-text")
        if (text != null) {
            return
        }
        let div = document.createElement('div');
        div.innerHTML = `<input autofocus="autofocus" cols="30" value="" type="text" id="id-text" class="float-input-text">`
        e("#id-canvas-area").append(div)
        // 添加样式
        let input = e("#id-text")
        input.style.display = "block"
        input.style.left = gx + "px"
        input.style.top = gy + "px"
        input.style.font = config.textFont.value
        input.focus()
    }

    pointInText(x, y) {
        for (let text of this.texts) {
            if (text.pointInFrame(x, y)) {
                return text
            }
        }
        return null
    }

    addText(content, x, y) {
        this.texts.push(GenText.new(this.scene, content, x, y))
    }

    draw() {
        let self = this
        for (let text of self.texts) {
            text.draw()
        }
    }
}