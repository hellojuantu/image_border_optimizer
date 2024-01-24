class GenComponent extends GenControls {
    constructor(scene) {
        super(scene)
        this.scene = scene
    }
    
    /**
     * 初始化组件的事件
     */
    setupEvents() {
    }

    /**
     * 组件模板
     */
    template(...datas) {
    }

    /**
     * 组件构建器
     */
    builder(...datas) {
    }

    /**
     * 外部使用组件
     */
    buildWith(...datas) {
        return this.builder(...datas)
    }

    /**
     * 外部获取模板
     */
    getTemplate() {
        return this.template
    }
}