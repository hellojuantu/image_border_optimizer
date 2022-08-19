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