class GenPoint extends GenShape {
    constructor(scene, x, y, status) {
        super(scene)
        this.x = x
        this.y = y
        this.status = status
        // property
        this.color = config.penColor.value
        this.lineWidth = config.penWeight.value
    }

    copyPropertyFrom(other) {
        this.color = other.color
        this.lineWidth = other.lineWidth
    }

    static new(...args) {
        return new this(...args)
    }

    static configAttribute() {
        return {
            "config.penWeight": config.penWeight,
            "config.penColor": config.penColor, 
        }
    }
}