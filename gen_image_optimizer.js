class GenOptimizer {
    constructor(runCallback) {
        this.runCallback = runCallback
        this.setup()
    }

    static instance (...args) {
        return new this(...args)
    }

    setup() {
        // canvas
        this.canvas = document.querySelector("#id-canvas")
        this.context = this.canvas.getContext('2d')
        // image and upload
        this.images = []
        this.bindUploadEvents()
    }

    runWithControls(controls) {
        controls.init()
        controls.drawImage()
    }
    
    __start() {
        this.runCallback(this)
    }

    bindUploadEvents() {
        var self = this
        var dp = e('#id-div-uploader')
    
        dp.addEventListener('dragover', function (e) {
            e.stopPropagation()
            e.preventDefault()
            e.dataTransfer.dropEffect = 'copy'
        })
    
        dp.addEventListener("drop", function (e) {
            e.stopPropagation()
            e.preventDefault()
            let files = Object.values(e.dataTransfer.files).filter(
                f => f.type.includes("image")
            )
            for (var file of files) {
                var reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onload = function (e) {
                    let img = new Image()
                    img.src = e.target.result
                    img.onload = function() { 
                        self.images.push(img)
                        if (self.images.length == files.length) {
                            log("__start")
                            self.__start()
                        }
                    }
                }
            }
        })
    }

}