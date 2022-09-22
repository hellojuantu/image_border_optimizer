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

    shapeChoosed() {
        return Object.keys(this.shapeTypes).includes(config.shapeSelect.value)
    }

    setup() {
        this.setupDraw()
        this.setupMove()
    }

    setupDraw() {
        let self = this
        let sc = self.scene
        let buildingShape = null
        self.optimizer.resgisterMouse(function(event, action) {
            if (!parseBoolean(config.shapeEnabled.value)) {
                return
            }
            let x = event.offsetX
            let y = event.offsetY
            log("shape", action, self.shapes)
            if (!self.shapeChoosed()) {
                return
            }
            if (action == 'down') {
                if (buildingShape == null) {
                    buildingShape = self.shapeTypes[config.shapeSelect.value].new(sc, x, y)
                    self.shapes.push(buildingShape)
                }
            } else if (action == 'move') {
                if (buildingShape != null) {
                    buildingShape.setMoving(x, y)
                }
            } else if (action == 'up') {
                if (buildingShape != null) {
                    buildingShape.checkAndClear()
                    buildingShape = null
                }
            }
        })
    }

    setupMove() {
        let self = this
        let ox = 0
        let oy = 0
        let draggedShape = null
        self.optimizer.resgisterMouse(function(event, action) {
            if (parseBoolean(config.shapeEnabled.value)) {
                return
            }
            let x = event.offsetX
            let y = event.offsetY
            let targetShape = self.pointInShape(x, y)
            // log("targetShape", targetShape, self.shapes)
            if (action == 'down') {
                if (targetShape != null && self.textUUID == null) {
                    ox = targetShape.x - x
                    oy = targetShape.y - y
                    draggedShape = targetShape
                }
            } else if (action == 'move') {
                if (draggedShape != null) {
                    draggedShape.x = x + ox
                    draggedShape.y = y + oy
                }
            } else if (action == 'up') {
                if (draggedShape != null) {
                    draggedShape = null
                }                
            }
        })
    }

    pointInShape(x, y) {
        for (let shape of this.shapes) {
            if (shape.pointInHollowFrame(x, y, shape.border) && !shape.deleted) {
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
        self.shapes = self.shapes.filter((s) => !s.deleted)
        for (let shape of self.shapes) {
            shape.draw()
        }
    }
}