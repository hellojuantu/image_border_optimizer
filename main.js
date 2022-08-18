var templateControls = function(key, item){
    var minAndMax = `
        max = ${item.max}
        min = ${item.min}
    `
    var t = `
        <div class="gen-controller">
            <label>
                <input class='gen-auto-slider' type="${item.type}"
                    value="${item.value}"
                    ${item.type == 'range' ? minAndMax : ''}
                    data-value="config.${key}"
                    >
                ${item._comment}: <span class="gen-label">${item.value}</span>
            </label>
        </div>
    `
    return t
}

var insertControls = function() {
    var div = e(".gen-controls")
    var keys = Object.keys(config)
    for (var k of keys) {
        var item = config[k]
        var html = templateControls(k, item)
        div.insertAdjacentHTML('beforeend', html)
    }
}

// config.xxx.prop = 
function updateControls(bindVarStr, updateValue) {
    var list = bindVarStr.split(".")
    var bind = list[1]
    var prop = list[2]
    var sliders = es('.gen-auto-slider')
    for (let i = 0; i < sliders.length; i++) {
        let slide = sliders[i]
        let bindVar = slide.dataset.value
        if (bindVar == `config.${bind}`) {
            if (config[bind]['valueType'] == 'number') {
                updateValue = parseInt(updateValue)
            } else if (config[bind]['valueType'] == 'string') {
                updateValue = String(updateValue)
            }
            config[bind][prop] = updateValue
            // eval(`config.${bind}.${prop} = ${updateValue}`)
            slide[prop] = updateValue
            if (prop == 'value') {
                var label = slide.closest('label').querySelector('.gen-label')
                label.innerText = updateValue
            }
            break
        }
    }
}

function fillImage(canvas, img) {
    var context = canvas.getContext('2d')
    // get config
    var offset = config.offset.value
    var io = config.imageOffset.value
    var shadowOffset = config.shadowOffset.value
    // 
    canvas.width = img.width + offset * 20
    canvas.height = img.height + offset * 20

    // clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height)

    // shadow
    context.save()
    context.globalAlpha = config.shadowColorAlpha.value / 10
    context.shadowOffsetX = shadowOffset
    context.shadowOffsetY = shadowOffset
    context.shadowColor = config.shadowColor.value
    context.shadowBlur = config.shadowBlur.value
    context.fillRect(io, io, img.width, img.height)
    context.restore()

    // draw main image
    context.drawImage(img, io, io)

    // draw shadow and border
    context.save()
    context.lineWidth = config.borderLength.value
    context.strokeStyle = config.borderColor.value
    context.beginPath()
    context.moveTo(io, io)
    context.lineTo(io, io + img.height)
    context.lineTo(io + img.width, io + img.height)
    context.lineTo(io + img.width, io)
    context.lineTo(io, io)
    context.closePath()
    context.stroke()
    context.restore()
}

function loadImages(convertImage) {
    let imagePaths = []
    let numberOfImages = parseInt(e("#id-input-number-files").value || 0)
    updateControls("config.index.max", numberOfImages - 1)
    for (let i = 1; i <= numberOfImages; i++) {
        let url = `./图片${i}.png`
        imagePaths.push(url)
    }
    // load image data
    var loads = []
    var images = []
    for (let i = 0; i < imagePaths.length; i++) {
        let path = imagePaths[i]
        let img = new Image()
        img.src = path
        img.onload = function() {
            // 存入 g.images 中
            images[i] = img
            // 所有图片都成功载入之后, 调用 run
            loads.push(1)
            log('load images', loads.length, imagePaths.length)
            if (loads.length == imagePaths.length) {
                log('load images', images)
                convertImage(images)
            }
        }
    }
}

function bindImageEvents(images) {
    var canvas = document.querySelector("#id-canvas")
    e("#id-save-pre").addEventListener('click', function(event) {
        if (config.index.value > 0) {
            var v = --config.index.value
            updateControls("config.index.value", v)
        }
        fillImage(canvas, images[config.index.value])
    })

    e("#id-save-next").addEventListener('click', function(event) {
        if (config.index.value < images.length - 1) {
            var v = ++config.index.value
            updateControls("config.index.value", v)
        }
        fillImage(canvas, images[config.index.value])
    })

    e("#id-save-center").addEventListener("click", function(event) {
        var w = canvas.width
        var img = images[config.index.value]
        var imgW = img.width
                        
        updateControls('config.imageOffset.value', (w - imgW) / 2)
        fillImage(canvas, img)
    })

    bindAll('.gen-auto-slider', 'input', function(event) {
        var target = event.target
        var bindVar = target.dataset.value
        var v = target.value
        updateControls(bindVar + '.value', v)
        var label = target.closest('label').querySelector('.gen-label')
        label.innerText = v
        fillImage(canvas, images[config.index.value])
    })
}

function bindEvents() {
    e("#id-load-reset").addEventListener("click", function(event) {
        loadImages(function(images) {
            var canvas = document.querySelector("#id-canvas")
            fillImage(canvas, images[config.index.value])
            bindImageEvents(images)
        }) 
    })

    e('#id-input-number-files').addEventListener('input', function(event) {
        let v = parseInt(event.target.value)
        updateControls("config.index.max", v)
    })
}

function __main() {   
    // 从配置文件生成 html 
    insertControls()
    // 绑定外部的事件
    bindEvents()
}

__main()