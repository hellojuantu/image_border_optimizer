class GenShape extends GenControls {
    constructor(scene) {
        super(scene)
        this.draggers = []
        this.numberOfDraggers = 0
        this.enumStatus = {
            creating: "creating",
            idle: "idle",
            selected: "selected",
            deleted: "deleted",
        }
        this.status = this.enumStatus.creating
        this.cursor = 'move'
    }

    static new(...args) {
        return new this(...args)
    }

    addDragger(dragger) {
        if (this.draggers.length < this.numberOfDraggers) {
            this.draggers.push(dragger)
        }
    }

    activateDraggers() {
        for (let drag of this.draggers) {
            // rect 还在创建中，不需要拖拽
            if (this.status == this.enumStatus.creating) {
                return
            }
            drag.active = true
        }
        this.selected()
    }

    hideDraggers() {
        for (let drag of this.draggers) {
            drag.active = false
        }
        this.idle()
    }

    isSelected() {
        return this.status == this.enumStatus.selected
    }

    selected() {
        this.status = this.enumStatus.selected
    }

    isCreating() {
        return this.status == this.enumStatus.creating
    }

    creating() {
        this.status = this.enumStatus.creating
    }

    isIdle() {
        return this.status == this.enumStatus.idle
    }

    idle() {                
        this.status = this.enumStatus.idle
    }

    deleted() {
        this.status = this.enumStatus.deleted
    }

    isDeleted() {
        return this.status == this.enumStatus.deleted
    }

    calcalateOffset(x, y) {
        this.ox = this.x - x
        this.oy = this.y - y            
    }

    moving(x, y) {
        this.x = x + this.ox
        this.y = y + this.oy
    }

    pointInShapeFrame(x, y) {}

    checkStatus() {}

    makeSpecial() {}
    
    draw() {
        for (let drag of this.draggers.filter(d => d.active)) {    
            // drag 需要跟随 rect 移动        
            drag.setPosition(this.x, this.y)
            drag.draw()
        }
    }
}