class ConfigControls extends GenControls {
    constructor(scene, pen) {
        super(scene)
        this.pen = pen
        this.setup()
    }

    setup() {
        var self = this
        var sc = self.scene
        var events = {
            "config.preButton": function(target) {
                if (config.index.value > 0) {
                    var v = config.index.value - 1
                    sc.updateControls("config.index.value", v)
                    self.pen.reset()
                }
            },
            "config.nextButton": function(target) {
                if (config.index.value < self.images.length - 1) {
                    var v = config.index.value + 1
                    sc.updateControls("config.index.value", v)
                    self.pen.reset()
                }
            },
            "config.centerButton": function(target) {
                var w = self.canvas.width
                var img = self.images[config.index.value]
                var imgW = img.width
                sc.updateControls('config.imageOffset.value', (w - imgW) / 2)
            },
            "config.penClearButton": function(target) {
                self.pen.reset()
            },
        }
        // 遍历 events 添加事件
        for (var eventName in events) {
            var callback = events[eventName]
            sc.addEvent(eventName, callback)
        }
    }
}