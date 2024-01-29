import {i18n} from "../config/i18n";

export default class GenI18nUtil {
    constructor() {
        // this.lang = persistedConfig.LOCALE_LAN.value
        this.lang = 'zh'
    }

    static new(...args) {
        return new this(...args)
    }

    getMessage(key) {
        try {
            let v = i18n[key][this.lang]
            if (v == null) {
                return key
            }
            return v
        } catch (e) {
            throw new Error(key + " I18n must be fill.")
        }
    }
}