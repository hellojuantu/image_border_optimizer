import GenComponent from "../gen_optimizer/gen_component";
import {
    appendHtml,
    e,
    es,
    log,
    removeClassAll,
    removeWithCondition,
    sel,
    toggleClass
} from "../gen_optimizer/gen_utils";
import {config} from "../config/config";
import Sortable from "sortablejs";
import FileSaver from 'file-saver'
import NormalPopTips from "./normal_pop_tips";

export default class PanelSelector extends GenComponent {
    constructor(control, w, h) {
        super(control.scene)
        this.control = control
        this.w = w
        this.h = h
        this.margin = 1
        this.ratio = this.scene.optimizer.ratio
        this.popTips = NormalPopTips.new(this.scene)
    }

    static new(...args) {
        return new this(...args)
    }

    setupEvents() {
        super.setupEvents()
        let control = this.control
        let self = this
        let sc = self.scene
        sc.registerGlobalEvents([
            // 左边图片列表事件
            {
                eventName: 'click',
                className: sc.pageClass.images,
                configToEvents: {
                    "config.index": function (target) {
                        let imageBlock = sel(sc.pageClass.imageBlock)
                        let index = target.closest(imageBlock).dataset.index
                        control.shapeControl.removeDraggers()
                        control.savePanel()
                        let v = parseInt(index)
                        control.switchPanel(v)
                    },
                    "action.delete": function (target) {
                        let imageBlock = sel(sc.pageClass.imageBlock)
                        let outer = target.closest(imageBlock)
                        let delId = parseInt(outer.dataset.index)
                        self.deleteImageWithDialog(target, imageBlock, delId)
                    },
                    "action.download": async function (target) {
                        try {
                            toggleClass(e("#id-loading-area"), "hide")
                            e(".progress").style.width = "100%"
                            let imageBlock = sel(sc.pageClass.imageBlock)
                            let outer = target.closest(imageBlock)
                            await self.control.compressImage(parseInt(outer.dataset.index), function (blob, imgName) {
                                FileSaver.saveAs(blob, imgName)
                                toggleClass(e("#id-loading-area"), "hide")
                                self.scene.message.success('导出成功')
                            })
                        } catch (err) {
                            toggleClass(e("#id-loading-area"), "hide")
                            self.scene.message.error(err)
                        }
                    },
                    "action.copyImage": async function (target) {
                        let imageBlock = sel(sc.pageClass.imageBlock)
                        let index = target.closest(imageBlock).dataset.index
                        control.shapeControl.removeDraggers()
                        control.savePanel()
                        let v = parseInt(index)
                        control.switchPanel(v)
                        await self.control.copyImage()
                    }
                }
            },
        ])

        this.setupSortable()
    }

    setupSortable() {
        let self = this
        let sc = self.scene
        let el = e(sel(sc.pageClass.images))
        Sortable.create(el, {
            draggable: '.image-block',
            handle: '.el-image',
            ghostClass: 'image-ghost',
            dragClass: 'image-dragger',
            swapThreshold: 1,
            fallbackTolerance: 3,
            onStart: function (evt) {
                self.control.shapeControl.removeDraggers()
                self.control.savePanel()
                removeClassAll('image-active')
                for (let div of es('.image-single-action')) {
                    div.classList.add('image-single-action-disable')
                }
            },
            onEnd: function (evt) {
                let oldIndex = evt.oldIndex
                let newIndex = evt.newIndex
                setTimeout(() => {
                    for (let div of es('.image-single-action')) {
                        div.classList.remove('image-single-action-disable')
                    }
                }, 300)
                if (oldIndex === newIndex) {
                    self.control.switchPanel(newIndex)
                    return
                }
                self.control.movePanel(oldIndex, newIndex)
                let bs = es(sel(sc.pageClass.imageBlock))
                for (let i = 0; i < bs.length; i++) {
                    bs[i].dataset.index = i
                }
                self.control.switchPanel(newIndex)
            },
        })
    }

    deleteImageWithDialog(target, imageBlock, delId) {
        let self = this
        let sc = self.scene
        this.popTips.buildWith(target, () => {
            // only one can't delete
            if (es(imageBlock).length <= 1) {
                sc.message.info('这是最后一个 panel 了, 留下 ta 好吗')
            } else {
                removeWithCondition(imageBlock, (e) => {
                    return e.dataset.index == delId
                })
                let bs = es(imageBlock)
                self.control.panelControl.delete(delId)
                config.index.max = self.panels.length - 1
                for (let i = 0; i < bs.length; i++) {
                    bs[i].dataset.index = i
                }
                if (delId == config.index.value) {
                    self.control.switchPanel(delId - 1 <= 0 ? 0 : delId - 1)
                } else if (delId < config.index.value) {
                    config.index.value -= 1
                }
                sc.message.success('删除成功')
            }
        }, () => {
        })
    }

    handleGlobalClickEvent(event) {
        let target = event.target
        if (target.dataset.value !== 'action.delete' && this.popTips.show === true) {
            this.popTips.close()
        }
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
        return `
        <div class="block image-block" data-value="config.index" data-index="${index}" data-type="${type}">
            <div class="el-image" data-value="config.index" style="width: ${this.w}px; height: ${this.h}px; display: block; margin: auto;">
                <canvas data-value="config.index" style="margin: ${this.margin}px; object-fit: scale-down;" class="el-image__inner editor edit canvas-area panel-canvas"></canvas>  
            </div>
            <div class="image-single-action">
                <div class="image-delete" data-value="action.delete">
                    <i class="el-icon-delete" data-value="action.delete" style="margin: 5px;"></i>
                </div>
                <div class="image-download" data-value="action.download">
                    <i class="el-icon-download" data-value="action.download" style="margin: 5px;"></i>
                </div>                
                <div class="image-copy" data-value="action.copyImage">
                    <i class="el-icon-document-copy" data-value="action.copyImage" style="margin: 5px;"></i>
                </div>
            </div>
        </div>
        `
    }
}