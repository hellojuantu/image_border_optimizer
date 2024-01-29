import GenComponent from "../gen_optimizer/gen_component";
import {appendHtml, e, es, log, parseBoolean, toggleClass} from "../gen_optimizer/gen_utils";

export default class Attribute extends GenComponent {
    constructor(control) {
        super(control.scene)
        this.control = control
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
            // 属性的事件       
            {
                eventName: "input",
                className: sc.pageClass.attribute,
                after: function (bindVar, target) {
                    log("input", bindVar, target)
                    let v = target.value
                    control.updateControls(bindVar + '.value', v)
                },
                configToEvents: {
                    "config.textFont": function (target) {
                        for (let shape of control.shapeControl.shapes.filter(s => s.isText)) {
                            if (shape.isSelected()) {
                                shape.font = target.value
                            }
                        }
                        if (control.textControl.inputOpen) {
                            let sel = "#" + control.textControl.inputId
                            let input = e(sel)
                            input.style.font = control.textControl.fixFont(target.value)
                            let zoom = self.parseValueWithType(e(".zoom-input").value, 'number') / 100
                            input.style.lineHight = zoom * calTextWH(input.value, input.style.font).w + "px"
                            // input.style.width = calTextWH(input.value, input.style.font).w + "px"
                        }
                    },
                    "config.textColor": function (target) {
                        log("control.shapeControl.shapes.filter(s => s.isText)", control.shapeControl.shapes.filter(s => s.isText))
                        for (let shape of control.shapeControl.shapes.filter(s => s.isText)) {
                            if (shape.isSelected()) {
                                shape.color = target.value
                            }
                        }
                        if (control.textControl.inputOpen) {
                            let sel = "#" + control.textControl.inputId
                            let input = e(sel)
                            input.style.color = target.value
                        }
                    },
                    "config.shapeBorder": function (target) {
                        for (let shape of control.shapeControl.shapes) {
                            if (shape.isSelected()) {
                                shape.border = self.parseValueWithType(target.value, 'number')
                            }
                        }
                    },
                    "config.shapeColor": function (target) {
                        for (let shape of control.shapeControl.shapes) {
                            if (shape.isSelected()) {
                                shape.color = target.value
                            }
                        }
                    },
                    "config.shapeWidth": function (target) {
                        for (let shape of control.shapeControl.shapes) {
                            if (shape.isSelected()) {
                                let w = self.parseValueWithType(target.value, 'number')
                                let offset = w - shape.w
                                let d = shape.rightBottomDragger()
                                let x = d.w / 2 + d.x + offset
                                let y = d.h / 2 + d.y
                                shape.movingByDragger(d, x, y)
                            }
                        }
                    },
                    "config.shapeHeight": function (target) {
                        for (let shape of control.shapeControl.shapes) {
                            if (shape.isSelected()) {
                                let h = self.parseValueWithType(target.value, 'number')
                                let offset = h - shape.h
                                let d = shape.rightBottomDragger()
                                let x = d.w / 2 + d.x
                                let y = d.h / 2 + d.y + offset
                                shape.movingByDragger(d, x, y)
                            }
                        }
                    },
                    "config.shapeX": function (target) {
                        for (let shape of control.shapeControl.shapes) {
                            if (shape.isSelected()) {
                                let x = self.parseValueWithType(target.value, 'number')
                                if (shape.isText) {
                                    shape.x = x
                                    continue
                                }
                                let offset = x - shape.x
                                // 遍历 4 个点, 都移动
                                for (let d of shape.draggers) {
                                    let dx = d.w / 2 + d.x + offset
                                    let dy = d.h / 2 + d.y
                                    shape.movingByDragger(d, dx, dy)
                                }
                            }
                        }
                    },
                    "config.shapeY": function (target) {
                        for (let shape of control.shapeControl.shapes) {
                            if (shape.isSelected()) {
                                let y = self.parseValueWithType(target.value, 'number')
                                if (shape.isText) {
                                    shape.y = y
                                    continue
                                }
                                let offset = y - shape.y
                                // 遍历 4 个点, 都移动
                                for (let d of shape.draggers) {
                                    let dx = d.w / 2 + d.x
                                    let dy = d.h / 2 + d.y + offset
                                    shape.movingByDragger(d, dx, dy)
                                }
                            }
                        }
                    },
                    "config.shapeRadiusX": function (target) {
                        for (let shape of control.shapeControl.shapes) {
                            if (shape.isSelected()) {
                                let w = self.parseValueWithType(target.value, 'number') * 2
                                let offset = w - shape.w
                                let d = shape.rightBottomDragger()
                                let x = d.w / 2 + d.x + offset
                                let y = d.h / 2 + d.y
                                shape.movingByDragger(d, x, y)
                            }
                        }
                    },
                    "config.shapeRadiusY": function (target) {
                        for (let shape of control.shapeControl.shapes) {
                            if (shape.isSelected()) {
                                let h = self.parseValueWithType(target.value, 'number') * 2
                                let offset = h - shape.h
                                let d = shape.rightBottomDragger()
                                let x = d.w / 2 + d.x
                                let y = d.h / 2 + d.y + offset
                                shape.movingByDragger(d, x, y)
                            }
                        }
                    },
                }
            },
            {
                eventName: "mousedown",
                className: sc.pageClass.attribute,
                configToEvents: {
                    "config.shapeFill": function (target) {
                        toggleClass(e('#id-icon-config-shapeFill'), "is-reverse")
                        toggleClass(e('#id-select-config-shapeFill'), "hide")
                    },
                    "read.option.shapeFill": function (target) {
                        let v = target.innerText
                        log("read", v)
                        for (let shape of control.shapeControl.shapes) {
                            if (shape.isSelected()) {
                                shape.fill = parseBoolean(v)
                            }
                        }
                        control.updateControls("config.shapeFill.value", v)
                    }
                },
                // useCapture: true,
            },
            {
                eventName: "focusout",
                className: sc.pageClass.attribute,
                configToEvents: {
                    "config.shapeFill": function (target) {
                        log('target', target)
                        toggleClass(e('#id-icon-config-shapeFill'), "is-reverse")
                        toggleClass(e('#id-select-config-shapeFill'), "hide")
                    },
                },
                // useCapture: true,
            },
        ])
    }

    builder(attributeMap) {
        log("attributeMap", attributeMap)
        Array.from(es(".el-form-item")).forEach(element => {
            element.remove()
        });
        let form = e(".gen-attribute")
        for (let bindVar of Object.keys(attributeMap)) {
            // log("bindVar", bindVar)
            let attribute = attributeMap[bindVar]
            if (attribute.default == null && attribute.value == null) {
                continue
            }
            let html = this.template(bindVar, attribute)
            appendHtml(form, html)
        }
    }

    selectTemplate(bindVar, attribute) {
        return `
        <div data-value="read.option.shapeFill" id="id-select-${bindVar.replace(".", "-")}" class="el-select-dropdown el-popper hide" x-placement="bottom-start" style="right: 0px;width: 100%;">
            <div class="el-scrollbar" style="">
                <div class="el-select-dropdown__wrap el-scrollbar__wrap el-scrollbar__wrap--hidden-default">
                    <ul class="el-scrollbar__view el-select-dropdown__list">
                        ${attribute.options.map(option => {
            return `<li data-value="read.option.shapeFill" class="el-select-dropdown__item">${option}</li>`
        }).join("\n")}
                    </ul>
                </div>
                <div class="el-scrollbar__bar is-horizontal">
                    <div class="el-scrollbar__thumb" style="transform: translateX(0%)"></div>
                </div>
                <div class="el-scrollbar__bar is-vertical">
                    <div class="el-scrollbar__thumb" style="transform: translateY(0%)"></div>
                </div>
            </div>
        </div>                 
        `
    }

    template(bindVar, attribute) {
        let minAndMax = `
            max = ${attribute.max || 1000}
            min = ${attribute.min || 1}
        `
        return `
        <div class="el-form-item el-form-item--small">
            <label class="el-form-item__label">${attribute._comment}</label>
            <div class="el-form-item__content ${attribute.options != null ? 'el-select' : ''}">
                <div class="el-input el-input--small">
                    <input 
                    type="${attribute.type}" 
                    data-value="${bindVar}" 
                    value="${attribute.value}" 
                    ${attribute.type == 'number' ? minAndMax : ''}
                    ${attribute.options != null ? 'readonly' : ''}
                    autocomplete="off" class="gen-input el-input__inner"/>
                    ${attribute.options != null ? `<span class="el-input__suffix" data-value="${bindVar}"><span class="el-input__suffix-inner" data-value="${bindVar}"><i id=id-icon-${bindVar.replace(".", "-")} data-value="${bindVar}" class="el-select__caret el-input__icon el-icon-arrow-up"></i></span></span>` : ''}
                </div>
                ${attribute.options != null ? this.selectTemplate(bindVar, attribute) : ''}
            </div>
        </div>
        `
    }
}