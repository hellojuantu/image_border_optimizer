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
        this.isSpecial = false
        this.isText = false
    }

    // -------- 拖拽相关 --------
    /**
     * 给 shape 添加拖拽点 (首先需要指定 numberOfDraggers 避免重复添加)
     */
    addDragger(dragger) {
        if (this.draggers.length < this.numberOfDraggers) {
            this.draggers.push(dragger)
        }
    }

    /** 
     * idle 中初始化所有的 dragger
     */
    setupDraggers() {}

    /**
     * 点击 shape 下的 dragger 触发的事件
     * 点击的 dragger
     * 鼠标 x y
     */
    movingByDragger(dragger, x, y) {}

    /**
     * 激活所有的拖拽点
     */
    activateDraggers() {
        for (let drag of this.draggers) {
            // rect 还在创建中，不需要拖拽
            if (this.isCreating()) {
                return null
            }
            drag.active = true
        }
        // 转换为 selected 状态
        return this.selected()
    }

    /**
     * 隐藏所有的拖拽点
     */
    hideDraggers() {
        for (let drag of this.draggers) {
            drag.active = false
        }
        this.idle()
    }

    /**
     * shape 的特殊形态 (按下 Shilft down 触发)
     */
    makeSpecial() {
        this.isSpecial = true
    }

    /**
     * shape 的默认形态 (按下 Shilft up 触发)
     */
    makeNormal() {
        this.isSpecial = false
    }

    // -------- shape 生命周期相关 ---------
    /**
     * creating(创建中) -> idle(闲置) -> deleted(删除)
     *                      ↓  ↑
     *                   selected(选中) -> moving(移动)
     */
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
        this.setupDraggers()           
        this.status = this.enumStatus.idle
    }

    deleted() {
        this.status = this.enumStatus.deleted
    }

    isDeleted() {
        return this.status == this.enumStatus.deleted
    }

    /**
     * idle 状态之后, 检查 shape 的状态, 判断是否满足 delete 的条件
     */
    checkStatus() {}

    // -------- shape 移动相关 ---------
    /**
     * 计算鼠标 x y 和 shape 的 偏移量
     */    
    calcalateOffset(x, y) {
        this.ox = this.x - x
        this.oy = this.y - y 
    }

    /**
     * 利用 offset 计算移动时坐标
     */
    moving(x, y) {
        this.x = x + this.ox
        this.y = y + this.oy
    }

    /**
     * 计算 x y 是否点击到了 shape
     */
    pointInShapeFrame(x, y) {}

    /**
     * 获取 shape 的中点坐标
     */
    center() {
        let x = this.x + this.w / 2
        let y = this.y + this.h / 2
        return Vector.new(x, y)
    }

    /** 
     * 连接 shape 所有的连接点
     */
    connectDraggers() {}

    // -------- 画图相关 ---------
    /**
     * draw 之前需要更新的所有数据
     */
    update() {}
    
    draw() {
        if (this.isSelected()) {
            this.context.save()
            this.context.beginPath()
            this.context.strokeStyle = '#29a1ff'
            this.context.lineWidth = 1

            this.connectDraggers()
            
            this.context.closePath()
            this.context.stroke()
            this.context.restore()
        }
        for (let drag of this.draggers.filter(d => d.active)) {    
            // drag 需要跟随 rect 移动        
            drag.draw()
        }
    }
}