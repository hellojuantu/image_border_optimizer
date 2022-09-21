var e = sel => document.querySelector(sel)

var log = console.log.bind(console)

var es = sel => document.querySelectorAll(sel)

var bindAll = function(sel, eventName, callback) {
    var l = es(sel)
    // log(l.length)
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

