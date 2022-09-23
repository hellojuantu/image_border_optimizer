class Vector {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    static new(...args) {
        return new this(...args)
    }

    distance(vector) {
        let v = vector
        let dx = v.x - this.x
        let dy = v.y - this.y
        return Math.sqrt(dx * dx + dy * dy)
    }

    sub(vector) {
        let v = vector
        let dx = this.x - v.x
        let dy = this.y - v.y
        return Vector.new(dx, dy)
    }

    angle(vector) {
        let v = vector
        const radian = this._getCosBy2pt(v)
        let angle = Math.acos(radian) * 180 / Math.PI
    
        if (v.x < this.x) {
            angle = -angle
        }
        return angle
    }

    _getCosBy2pt(vector) {
        let a = vector.sub(this)
        let b = Vector.new(0, -1)
        return this._calCos(a, b)
    }
    
    _calCos(a, b) {
        // 点积
        let dotProduct = a.x * b.x + a.y * b.y
        let d = Math.sqrt(a.x * a.x + a.y * a.y) * Math.sqrt(b.x * b.x + b.y * b.y)
        return dotProduct / d;
    }
}