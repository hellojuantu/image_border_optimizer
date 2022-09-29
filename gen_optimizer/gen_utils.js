var e = sel => document.querySelector(sel)

var log = console.log.bind(console)

var es = sel => document.querySelectorAll(sel)

var bindAll = function(sel, eventName, callback) {
    var l = es(sel)
    for (var i = 0; i < l.length; i++ ) {
        var input = l[i]
        input.addEventListener(eventName, function(event) {
            callback(event)
        })
    }
}

var bind = function(sel, eventName, callback) {
    e(sel).addEventListener(eventName, function(event) {
        callback(event)
    })
}

var parseBoolean = function(booleanString) {
    return JSON.parse(booleanString)
}

var appendHtml = function(div, html) {
    div.insertAdjacentHTML('beforeend', html)
}

var uuid = function() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		let r = Math.random() * 16 | 0
	    let v = (c == 'x' ? r : (r & 0x3 | 0x8))
		return v.toString(16)
	});
}

var sel = function(className) {
    return '.' + className
}

const toggleClass = function (element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className)
    } else {
        element.classList.add(className)
    }
}

const addClassAll = function (selector, className) {
    let elements = document.querySelectorAll(selector)
    for (let element of elements) {
        element.classList.add(className)
    }
}

const removeClassAll = function (className) {
    let selector = '.' + className
    let elements = document.querySelectorAll(selector)
    for (let i = 0; i < elements.length; i++) {
        let e = elements[i]
        e.classList.remove(className)
    }
}

const removeClassAllWithCallback = function (className, callback) {
    let selector = '.' + className
    let elements = document.querySelectorAll(selector)
    for (let i = 0; i < elements.length; i++) {
        let e = elements[i]
        e.classList.remove(className)
        callback(e)
    }
}

const removeClassAllWithCondition = function (className, removedType) {
    let selector = '.' + className
    let elements = document.querySelectorAll(selector)
    for (let i = 0; i < elements.length; i++) {
        let e = elements[i]
        log("e", e)
        if (e.dataset.type === removedType) {
            e.classList.remove(className)
        }
    }
}

const calTextWH = function(text, font) {
    let canvas = e("#id-canvas")
    let context = canvas.getContext('2d')
    context.save()
    context.textBaseline = "top"
    context.font = font
    let metrics = context.measureText(text)
    let w = parseInt(metrics.width) + 1
    let h = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent
    context.restore()
    return {
        w: w,
        h: h,
    }
}

async function clipboardImg(url) {
    try {
        const data = await fetch(url)
        const blob = await data.blob()
        await navigator.clipboard.write([
            new window.ClipboardItem({
                [blob.type]: blob
            })
        ])        
        alert('复制成功')
    } catch (err) {
        alert('复制失败')
    }
}
