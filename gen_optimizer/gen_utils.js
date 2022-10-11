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
    let canvas = document.createElement("canvas")
    let context = canvas.getContext('2d')
    context.textBaseline = "top"
    context.font = font
    let metrics = context.measureText(text)
    let w = parseInt(metrics.width)
    let h = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent
    return {
        w: w,
        h: h,
    }
}

const calCols = function(text) {
    text = text.trim()
    // 一个中文字符占两个长度
    let length = 0
    for (let i = 0; i < text.length; i++) {
        let c = text[i]
        if (c.charCodeAt(0) > 255) {
            length += 2
        } else {
            length += 1
        }
    }
    return length
}

const selectAll = function(id) {
    if (document.selection) {
        var range = document.body.createTextRange()
        range.moveToElementText(document.getElementById(id))
        range.select()
    } else if (window.getSelection) {
        var range = document.createRange()
        range.selectNodeContents(document.getElementById(id))
        window.getSelection().removeAllRanges()
        window.getSelection().addRange(range)
    }
}

const calHeightLine = function(value, font, zoom) {
    let lines = value.split('\n')
    let max = lines[0]
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i]
        if (!isBlank(line) && line.length > max.length) {
            max = line
        }
    }
    let p = calTextWH(max, font)
    return p.h * zoom
}

const getRows = function(text, width, font) {
    let chr = text.split("")
    let temp = ""
    let rows = []

    for (let a = 0; a < chr.length; a++){
        let c = chr[a]
        if (c === '\n') {
            rows.push(temp)
            temp = ""
            continue
        }

        if (calTextWH(temp, font).w < width && 
            calTextWH(temp + (c), font).w <= width) {
            temp += c
            if (a === chr.length - 1 && c !== "\n") {
                rows.push(temp)
            }
        } else {
            rows.push(temp)
            temp = c
        }
    }
    return rows
}

const isBlank = function(str) {
    return (!str || /^\s*$/.test(str))
}