class ShapeControls extends GenControls {
    constructor(scene) {
        super(scene)
        this.setup()
        this.shapes = []
        this.shapeTypes = {
            'rect': GenRect,
            'arrow': GenArrow,
        }
    }

    allDraggers() {
        let allDraggers = []
        for (let shape of this.shapes) {
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
                self.shapes.push(targetShape)
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
                self.buildingShape.activateDraggers()
                self.buildingShape.checkStatus()
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
            log("Backspace", status)
            for (let shape of this.shapes) {
                if (shape.isSelected()) {
                    shape.deleted()
                }
            }
        })

        this.optimizer.registerAction("Shift", status => {
            log("Shift", status)
            for (let shape of this.shapes) {
                if (shape.isCreating()) {
                    shape.makeSpecial()
                }
            }
        })
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

    draw() {
        let self = this
        self.shapes = self.shapes.filter((s) => !s.isDeleted())
        for (let shape of self.shapes) {
            shape.draw()
        }
    }
}