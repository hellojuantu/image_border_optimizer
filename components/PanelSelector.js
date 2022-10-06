class PanelSelector extends GenComponent {
    constructor(control) {
        super(control.scene)
        this.control = control
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
                        // 删除自己跳转到 index 0
                        if (delId == config.index.value) {
                            control.switchPanel(0)
                        } else if (delId < config.index.value) {
                            config.index.value -= 1
                        }
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
        let url = image.src
        let index = image.dataset.index
        let type = image.dataset.type
        let t = `
        <div class="block image-block" data-value="config.index" data-index="${index}" data-type="${type}">
            <div class="el-image" data-value="config.index" style="width: 100px; height: 100px;display: block;margin: auto;">
                <img src="${url}" data-value="config.index" class="el-image__inner" style="object-fit: scale-down;">
            </div>
            <div class="image-delete" data-value="action.delete">
                <i class="el-icon-delete" data-value="action.delete" style="margin: 5px;"></i>
            </div>
        </div>
        `
        return t
    }
}