import GenComponent from "../gen_optimizer/gen_component";
import {appendHtml, e, isBlank, sel} from "../gen_optimizer/gen_utils";
import GenPersistConfigManager from "../gen_optimizer/gen_persisit_config_manager";
import DataTable from "../public/js/datatable.min";
import SettingPopTips from "./setting_pop_tips";
import {persistedConfig} from "../config/config";
import GenI18nUtil from "../gen_optimizer/gen_i18n_util";

export default class SettingDialog extends GenComponent {
    constructor(scene) {
        super(scene);
        scene.registerPageClass({
            "dialog": 'dialog',
            "dialogFooter": "dialog-footer",
            "dialogClose": "dialog-close",
            "dialogContent": "dialog-content",
        })

        this.popTips = SettingPopTips.new(scene)
    }

    setupEvents() {
        super.setupEvents()

        let settingData = []
        for (let key in persistedConfig) {
            let config = persistedConfig[key]
            settingData.push({
                key: key,
                defaultValue: config.defaultValue || '',
                value: config.value || '',
                originValue: config.value || '',
                updated: false,
                desc: config.desc || '',
            })
        }
        let settingTable = new DataTable(e("#my-table"), {
            identify: 'key',
            data: settingData,
            lineFormat: function (id, data) {
                let res = document.createElement('tr')
                for (let key in data) {
                    if (key === 'updated' || key === 'originValue') {
                        continue
                    }
                    let td = document.createElement('td')
                    let value = data[key]
                    if (key === 'value') {
                        if (isBlank(value)) {
                            value = '-'
                        }
                        td.style = 'width: 170px; '
                        td.innerHTML = `
                            <div class="gen-table-cell">
                                <span style="display: flex;justify-content: space-between;align-items: center;flex-direction: row;">
                                    <span style="margin-right: 16px;display: inline-block;width: 60px;">${value}</span>
                                    ${data.updated ? `<i data-value="action.restore" data-param="${data.key}" class="gen-table-action-icon el-icon-refresh-left" style="cursor:pointer;"></i>` : `<i data-value="action.showPopTip" data-param="${data.key}" class="gen-table-action-icon el-icon-edit-outline" style="cursor:pointer;"></i>`}                               
                                </span>
                            </div>`
                    } else if (key === 'defaultValue') {
                        if (isBlank(value)) {
                            value = '-'
                        }
                        td.innerHTML = value
                    } else if (key === 'key') {
                        td.innerHTML = `${GenI18nUtil.new().getMessage(value)}`
                    } else {
                        td.innerHTML = value
                    }
                    res.appendChild(td)

                }
                return res
            }
        })

        let self = this
        let sc = self.scene
        sc.registerGlobalEvents([
            {
                eventName: 'click',
                className: sc.pageClass.dialog,
                after: function (bindVar, target, event) {
                    if (bindVar !== 'action.showPopTip' && self.popTips.show === true) {
                        self.popTips.close()
                    }
                },
                configToEvents: {
                    "action.cancel": function (target) {
                        if (self.popTips.show) {
                            return
                        }
                        self.close()
                    },
                    "action.confirm": function (target) {
                        let lines = settingTable.all();
                        for (let line of lines) {
                            if (!line.updated) {
                                continue
                            }
                            let key = `${line.key}.value`
                            GenPersistConfigManager.new().savePersistConfig(key, line.value)
                        }
                        if (self.popTips.show) {
                            return
                        }
                        sc.message.success('保存成功')
                        self.close()
                    },
                    "action.close": function (target) {
                        if (self.popTips.show) {
                            return
                        }
                        self.close()
                    },
                    "action.showPopTip": function (target, event) {
                        if (self.popTips.show) {
                            self.popTips.close()
                        }
                        let param = target.dataset.param
                        self.popTips.buildWith(target, function (updatedVal) {
                            updatedVal = updatedVal.trim()
                            if (settingTable.row(param).value !== updatedVal) {
                                settingTable.updateRow(param, {value: updatedVal, updated: true})
                            }
                        })
                    },
                    "action.restore": function (target) {
                        let param = target.dataset.param
                        console.log("restore", param, settingTable.row(param))
                        let row = settingTable.row(param);
                        settingTable.updateRow(param, {value: row.originValue, updated: false})
                    }
                },
            },
        ])
    }

    template() {
        this.title = '设置'

        return `
        <div class="dialog" data-value="dialog.area">
            <div class="dialog-main" data-value="dialog.area">
                <div class="dialog-header" data-value="dialog.area">
                    <p class="el-dialog__title">${this.title}</p>                    
                    <button type="button" aria-label="Close" class="el-message-box__headerbtn dialog-close">
                        <i data-value="action.close" class="el-message-box__close el-icon-close"></i>
                    </button>
                </div>
                <div class="dialog-content" data-value="dialog.area">                    
                    <table id="my-table" class="table table-bordered">
                        <thead>
                            <tr>
                                <th>设置项</th>
                                <th>默认值</th>
                                <th>当前值</th>
                                <th>可修改范围</th>                               
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>                                        
                </div>
                <div class="dialog-footer" data-value="dialog.area">
                    <button data-value="action.cancel" class="dialog-button el-button el-button--default is-plain el-button--small">取消</button>
                    <button data-value="action.confirm" class="dialog-button el-button el-button--primary el-button--small">保存</button>
                </div>
            </div>
        </div>
        `
    }

    builder() {
        appendHtml(e('body'), this.template())
        this.show()
    }

    buildWith(...datas) {
        this.builder(...datas)
        this.setupEvents()
    }

    show() {
        let self = this
        let sc = self.scene
        const dialog = e(sel(sc.pageClass.dialog))
        dialog.classList.add('dialog-show')
        setTimeout(() => dialog.classList.add('dialog-appear'))
    }

    close() {
        let self = this
        let sc = self.scene
        const dialog = e(sel(sc.pageClass.dialog))
        dialog.classList.remove('dialog-appear')
        setTimeout(() => {
            dialog.classList.remove('dialog-show')
            dialog.remove()
        }, 400)
    }
}