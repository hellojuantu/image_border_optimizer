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
        this.setupKey()
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
            if (!self.shapeChoosed()) {
                return
            }
            let targetShape = self.pointInShape(x, y)
            log("shape", action, self.shapes, targetShape)
            if (action == 'down') {
                // 鼠标没有点到其他 shape
                if (targetShape == null) {
                    buildingShape = self.shapeTypes[config.shapeSelect.value].new(sc, x, y)
                    self.shapes.push(buildingShape)
                }
            } else if (action == 'move') {
                if (buildingShape != null) {
                    buildingShape.creating(x, y)
                }
            } else if (action == 'up') {
                if (buildingShape != null) {
                    buildingShape.idle()
                    self.removeDraggers()
                    buildingShape.activateDraggers()
                    buildingShape = null
                }
            }
        })
    }

    // setupMove() {
    //     let self = this
    //     let ox = 0
    //     let oy = 0
    //     let draggedShape = null
    //     self.optimizer.resgisterMouse(function(event, action) {            
    //         let x = event.offsetX
    //         let y = event.offsetY
    //         let targetShape = self.pointInShape(x, y)
    //         log("targetShape", targetShape, self.shapes, action)
    //         if (action == 'down') {
    //             if (targetShape != null && !targetShape.isCreating()) {
    //                 draggedShape = targetShape
    //                 ox = draggedShape.x - x
    //                 oy = draggedShape.y - y     
    //                 draggedShape.selected()
    //             }
    //         } else if (action == 'move') {
    //             if (draggedShape != null && draggedShape.isSelected()) {
    //                 draggedShape.x = x + ox
    //                 draggedShape.y = y + oy
    //             }
    //         } else if (action == 'up') {
    //             if (draggedShape != null) {
    //                 draggedShape = null
    //             }                
    //         } 
    //     })
    // }

    removeDraggers() {
        for (let shape of this.shapes) {
            shape.hideDraggers()
        }
    }

    setupKey() {
        this.optimizer.registerAction("Backspace", function(status) {
            log("s", status)
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