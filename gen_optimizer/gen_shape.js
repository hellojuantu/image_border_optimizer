class GenShape extends GenControls {
    constructor(scene) {
        super(scene)
        this.deleted = false
    }

    setMoving(x, y) {
    }

    checkAndClear() {
    }

    pointInFrame(x, y) {
        let xIn = x >= this.x && x <= this.x + this.w
        let yIn = y >= this.y && y <= this.y + this.h
        return xIn && yIn
    }

    pointInHollowFrame(x, y, border) {
        // 坐标在空心矩阵边框上
        let xIn = x >= this.x - border && x <= this.x + this.w + border
        let yIn = y >= this.y - border && y <= this.y + this.h + border
        let inFrame = xIn && yIn
        // 坐标在空心矩阵内部
        let xIn2 = x >= this.x + border && x <= this.x + this.w - border
        let yIn2 = y >= this.y + border && y <= this.y + this.h - border
        let inHollow = xIn2 && yIn2
        return inFrame && !inHollow
    }
}