class ShapeControls extends GenControls {
    constructor(scene) {
        super(scene)
        this.setup()
        this.shapes = []
        this.shapeTypes = {
            'rect': GenRect,
            'arrow': GenArrow,
            'circle': GenCircle,
            'line': GenLine,
        }
    }

    allDraggers() {
        let allDraggers = []
        for (let shape of this.shapes) {
            // addAll()
            allDraggers.push(...shape.draggers)
        }
        return allDraggers
    }

    shapeChoosed() {
        return Object.keys(this.shapeTypes).includes(config.shapeSelect.value)
    }

    setup() {
        this.buildingShape = null
        this.setupKey()
    }

    handleImageEvent(image, x, y) {
        let self = this
        let sc = self.scene
        log("handleImageEvent", image, x, y)
        // 直接生成图片
        let uploadImage = GenImage.new(sc, x, y, image)
        self.shapes.unshift(uploadImage)

        let w = image.width
        let h = image.height
        uploadImage.creating(x + w, y + h)

        uploadImage.idle()
        self.removeDraggers()
        let att = uploadImage.activateDraggers()
        sc.getComponent('attribute').buildWith(att)
        uploadImage.checkStatus()
    }

    handleShapeEvent(action, x, y, targetShape) {
        let self = this
        let sc = self.scene
        if (!parseBoolean(config.shapeEnabled.value)) {
            return
        }
        if (!self.shapeChoosed()) {
            return
        }
        if (action == 'down') {
            log("shape", action, self.shapes, targetShape)
            // 鼠标没有点到其他 shape
            if (targetShape == null) {
                self.buildingShape = null
                targetShape = self.shapeTypes[config.shapeSelect.value].new(sc, x, y)
                self.shapes.unshift(targetShape)
                self.buildingShape = targetShape
            }
        } else if (action == 'move') {
            log("shape", action, self.shapes, self.buildingShape)
            if (self.buildingShape != null) {
                self.buildingShape.creating(x, y)
            }
        } else if (action == 'up') {
            log("shape", action, self.shapes, self.buildingShape)
            if (self.buildingShape != null) {
                self.buildingShape.idle()
                self.removeDraggers()
                let att = self.buildingShape.activateDraggers()
                sc.getComponent('attribute').buildWith(att)
                self.buildingShape.checkStatus()
                log("+++shapes", self.shapes)
                self.buildingShape = null
            }
        }
    }

    removeDraggers() {
        for (let shape of this.shapes) {
            shape.hideDraggers()
        }
    }

    setupKey() {
        this.optimizer.registerAction("Backspace", status => {
            if (!this.scene.pointInScene) {
                return
            }
            log("Backspace", status)
            for (let shape of this.shapes) {
                if (shape.isSelected()) {
                    shape.deleted()
                }
            }
        })

        // TODO
        // this.optimizer.registerAction("Shift", status => {
        //     if (!this.scene.pointInScene) {
        //         return
        //     }
        //     log("Shift", status)
        //     for (let shape of this.shapes) {
        //         if (shape.isCreating()) {
        //             if (status == 'down') {
        //                 shape.makeSpecial()
        //             } else if (status == 'up') {
        //                 shape.makeNormal()
        //             }
        //         }
        //     }
        // })
    }

    pointInShape(x, y) {
        for (let shape of this.shapes) {
            if (shape.pointInShapeFrame(x, y) && !shape.isDeleted()) {
                return shape
            }
        }
        return null
    }

    resetAndUpdate(shapes) {
        this.shapes = shapes
    }

    update() {
        let self = this
        self.shapes = self.shapes.filter((s) => {
            if (s.isCreating() || s.isSelected()) {
                return true
            }
            s.checkStatus()
            return !s.isDeleted()
        })
        // 遍历 shapes 把 selected shape 的移到末尾, 其他顺序不变
        let selectedShape = null
        for (let i = self.shapes.length - 1; i >= 0; i--) {
            let shape = self.shapes[i]
            if (shape.isSelected()) {
                selectedShape = shape
                self.shapes.splice(i, 1)
                break
            }
        }
        if (selectedShape != null) {
            self.shapes.unshift(selectedShape)
        }
        for (let i = self.shapes.length - 1; i >= 0; i--) {
            let shape = self.shapes[i]
            shape.update()
        }
    }

    draw() {
        let self = this
        self.shapes = self.shapes.filter((s) => {
            if (s.isCreating() || s.isSelected()) {
                return true
            }
            s.checkStatus()
            return !s.isDeleted()
        })
        // 遍历 shapes 把 selected shape 的移到末尾, 其他顺序不变
        let selectedShape = null
        for (let i = self.shapes.length - 1; i >= 0; i--) {
            let shape = self.shapes[i]
            if (shape.isSelected()) {
                selectedShape = shape
                self.shapes.splice(i, 1)
                break
            }
        }
        if (selectedShape != null) {
            self.shapes.unshift(selectedShape)
        }
        for (let i = self.shapes.length - 1; i >= 0; i--) {
            let shape = self.shapes[i]
            shape.draw()
        }
    }
}