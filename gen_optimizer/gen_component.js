class GenComponent {
    constructor(builder, template, scene) {
        this.builder = builder
        this.template = template
        this.scene = scene
    }

    static new(builder, template) {
        return new this(builder, template)
    }

    buildWith(...datas) {
        return this.builder(...datas)
    }

    getTemplate() {
        return this.template
    }
}