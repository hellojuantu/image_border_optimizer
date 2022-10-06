const e = sel => document.querySelector(sel)

let log = function() {
    
}

const es = sel => document.querySelectorAll(sel)

const bindAll = function(sel, eventName, callback, useCapture=false) {
    let l = es(sel)
    for (let i = 0; i < l.length; i++ ) {
        let input = l[i]
        input.addEventListener(eventName, function(event) {
            callback(event)
        }, useCapture)
    }
}

const bind = function(sel, eventName, callback) {
    e(sel).addEventListener(eventName, function(event) {
        callback(event)
    })
}

const parseBoolean = function(booleanString) {
    return JSON.parse(booleanString)
}

const appendHtml = function(div, html) {
    div.insertAdjacentHTML('beforeend', html)
}

const uuid = function() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		let r = Math.random() * 16 | 0
	    let v = (c == 'x' ? r : (r & 0x3 | 0x8))
		return v.toString(16)
	});
}

const sel = function(className) {
    return '.' + className
}

const id = function(idName) {
    return '#' + idName
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

const removeWithCondition = function(selector, condition) {
    let elements = es(selector)
    for (let e of elements) {
        if (condition(e)) {
            e.remove()
            break;
        }
    }
}

const removeClassAllWithIndex = function (className, removedIndex) {
    let selector = '.' + className
    let elements = document.querySelectorAll(selector)
    for (let i = 0; i < elements.length; i++) {
        let e = elements[i]
        if (e.dataset.index === removedIndex) {
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
