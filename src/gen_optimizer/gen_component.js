import GenControls from "./gen_controls";

export default class GenComponent extends GenControls {
    constructor(scene) {
        super(scene)
        this.scene = scene
        this.eventInited = false
    }

    /**
     * 初始化组件的事件
     */
    setupEvents() {
        this.eventInited = true
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
        this.builder(...datas)
        if (!this.eventInited) {
            this.setupEvents()
        }
    }
}