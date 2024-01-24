export const e = sel => document.querySelector(sel)

export var log = console.log.bind(console)

export const es = sel => document.querySelectorAll(sel)

export const bindAll = function (sel, eventName, callback, useCapture = false) {
    let l = es(sel)
    for (let i = 0; i < l.length; i++) {
        let input = l[i]
        input.addEventListener(eventName, function (event) {
            callback(event)
        }, useCapture)
    }
}

export const bind = function (sel, eventName, callback) {
    e(sel).addEventListener(eventName, function (event) {
        callback(event)
    })
}

export const parseBoolean = function (booleanString) {
    return JSON.parse(booleanString)
}

export const appendHtml = function (div, html) {
    div.insertAdjacentHTML('beforeend', html)
}

export const uuid = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0
        let v = (c == 'x' ? r : (r & 0x3 | 0x8))
        return v.toString(16)
    });
}

export const sel = function (className) {
    return '.' + className
}

export const id = function (idName) {
    return '#' + idName
}

export const toggleClass = function (element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className)
    } else {
        element.classList.add(className)
    }
}

export const addClassAll = function (selector, className) {
    let elements = document.querySelectorAll(selector)
    for (let element of elements) {
        element.classList.add(className)
    }
}

export const removeClassAll = function (className) {
    let selector = '.' + className
    let elements = document.querySelectorAll(selector)
    for (let i = 0; i < elements.length; i++) {
        let e = elements[i]
        e.classList.remove(className)
    }
}

export const removeClassAllWithCallback = function (className, callback) {
    let selector = '.' + className
    let elements = document.querySelectorAll(selector)
    for (let i = 0; i < elements.length; i++) {
        let e = elements[i]
        e.classList.remove(className)
        callback(e)
    }
}

export const removeWithCondition = function (selector, condition) {
    let elements = es(selector)
    for (let e of elements) {
        if (condition(e)) {
            e.remove()
            break;
        }
    }
}

export const removeClassAllWithIndex = function (className, removedIndex) {
    let selector = '.' + className
    let elements = document.querySelectorAll(selector)
    for (let i = 0; i < elements.length; i++) {
        let e = elements[i]
        if (e.dataset.index == removedIndex) {
            e.classList.remove(className)
        }
    }
}

export const calTextWH = function (text, font) {
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

export const calCols = function (text) {
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

export const selectAll = function (id) {
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

export const calHeightLine = function (value, font, zoom) {
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

export const getRows = function (text, width, font) {
    let chr = text.split("")
    let temp = ""
    let rows = []

    for (let a = 0; a < chr.length; a++) {
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

export const isBlank = function (str) {
    return (!str || /^\s*$/.test(str))
}

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

export const now = function () {
    return new Date().Format("yyyy/MM/dd hh:mm:ss");
}

export const scrollToBottom = function (domWrapper) {
    (function smoothscroll() {
        // 已经被卷掉的高度
        const currentScroll = domWrapper.scrollTop
        // 容器高度
        const clientHeight = domWrapper.offsetHeight
        // 内容总高度
        const scrollHeight = domWrapper.scrollHeight
        if (scrollHeight - 10 > currentScroll + clientHeight) {
            window.requestAnimationFrame(smoothscroll)
            domWrapper.scrollTo(0, currentScroll + (scrollHeight - currentScroll - clientHeight) / 2)
        }
    })()
}

export const genRandomString = function (n) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < n; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export function ajax(method, path, data, reseponseCallback) {
    const r = new XMLHttpRequest();
    r.open(method, path, true)
    r.setRequestHeader('Content-Type', 'application/json');
    r.setRequestHeader('Authorization', `Basic ${btoa(`api:lxK7FQVrlmm2WbQ5c2nlRMzx9RJ5MYXc`)}`);
    r.setRequestHeader("Access-Control-Allow-Origin", "*")
    r.onreadystatechange = function () {
        if (r.readyState === 4) {
            reseponseCallback(r)
        }
    }
    r.send(data)
}