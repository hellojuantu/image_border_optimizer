class GenShape extends GenControls {
    constructor(scene) {
        super(scene)
        this.draggers = []
        this.enumStatus = {
            creating: "creating",
            idle: "idle",
            selected: "selected",
            deleted: "deleted",
        }
        this.status = this.enumStatus.creating
    }

    static new(...args) {
        return new this(...args)
    }

    activateDraggers() {
        for (let drag of this.draggers) {
            // rect 还在创建中，不需要拖拽
            if (this.status == this.enumStatus.creating) {
                return
            }
            drag.active = true
        }
    }

    hideDraggers() {
        for (let drag of this.draggers) {
            drag.active = false
        }
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

    pointInShapeFrame(x, y) {}

    draw() {
        for (let drag of this.draggers.filter(d => d.active)) {    
            // drag 需要跟随 rect 移动        
            drag.setPosition(this.x, this.y)
            drag.draw()
        }
    }
}