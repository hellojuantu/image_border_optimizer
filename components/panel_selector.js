class PanelSelector extends GenComponent {
    constructor(control, w, h) {
        super(control.scene)
        this.control = control
        this.w = w
        this.h = h
        this.margin = 1
        this.ratio = this.scene.optimizer.ratio
    }

    static new(...args) {
        return new this(...args)
    }

    setupEvents() {
        let control = this.control
        let self = this
        let sc = self.scene
        sc.registerGlobalEvents([
            // 左边图片列表事件
            {
                eventName: 'click',
                className: sc.pageClass.images,
                configToEvents: {                    
                    "config.index": function(target) {
                        let imageBlock = sel(sc.pageClass.imageBlock)
                        let index = target.closest(imageBlock).dataset.index
                        control.shapeControl.removeDraggers()
                        control.savePanel()
                        let v = parseInt(index)
                        control.switchPanel(v)
                    },
                    "action.delete": function(target) {
                        let imageBlock = sel(sc.pageClass.imageBlock)
                        let outer = target.closest(imageBlock)
                        let delId = parseInt(outer.dataset.index)
                        // only one can't delete
                        if (es(imageBlock).length <= 1) {                        
                            sc.message.info('这是最后一个 panel 了, 留下 ta 好吗')
                            return
                        }
                        removeWithCondition(imageBlock, (e) => {
                            return e.dataset.index == delId
                        })
                        let bs = es(imageBlock)
                        control.panelControl.delete(delId)
                        config.index.max = self.panels.length - 1                        
                        // 重新给 image-list 分配 index
                        for (let i = 0; i < bs.length; i++) {
                            bs[i].dataset.index = i                            
                        }
                        // 删除自己跳转到上一个
                        if (delId == config.index.value) {
                            control.switchPanel(delId - 1 <= 0 ? 0 : delId - 1)
                        } else if (delId < config.index.value) {
                            config.index.value -= 1
                        }
                        sc.message.success('删除成功')
                    }
                }
            },
        ])
    }

    builder(panelSnapshots) {
        log("panelSnapshots", panelSnapshots)
        let list = e(".image-list")
        let max = config.index.max
        for (let i = 0; i < panelSnapshots.length; i++) {
            let image = panelSnapshots[i]
            image.dataset.index = i + max + 1
            let html = this.template(image)
            appendHtml(list, html)
            // render panel canvas
            let canvas = es('.panel-canvas')[image.dataset.index]
            canvas.width = this.w 
            canvas.height = this.h
            let ctx = canvas.getContext('2d')
            ctx.drawImage(image, 0, 0, this.w * this.ratio, this.h * this.ratio)
        }       
        //
        removeClassAll('image-active')
        for (let block of es('.image-block')) {
            let v = config.index.value
            if (block.dataset.index == v) {
                block.classList.add('image-active')
            }
        }
    }

    template(image) {
        let index = image.dataset.index
        let type = image.dataset.type
        let t = `
        <div class="block image-block" data-value="config.index" data-index="${index}" data-type="${type}">
            <div class="el-image" data-value="config.index" style="width: ${this.w}px; height: ${this.h}px; display: block; margin: auto;">
                <canvas data-value="config.index" style="margin: ${this.margin}px; object-fit: scale-down;" class="el-image__inner editor edit canvas-area panel-canvas"></canvas>  
            </div>
            <div class="image-delete" data-value="action.delete">
                <i class="el-icon-delete" data-value="action.delete" style="margin: 5px;"></i>
            </div>
        </div>
        `
        return t
    }
}