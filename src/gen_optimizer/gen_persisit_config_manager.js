import {persistedConfig} from "../config/config";

export default class GenPersistConfigManager {
    constructor() {
    }

    static new(...args) {
        return new this(...args)
    }

    loadPersistConfig() {
        for (let key in persistedConfig) {
            let item = localStorage.getItem(key);
            if (item == null) {
                delete localStorage[key]
            } else {
                try {
                    persistedConfig[key].value = JSON.parse(item).value
                } catch (e) {
                    delete localStorage[key]
                }
            }
        }
    }

    savePersistConfig(key, value) {
        this.__save(key, value, persistedConfig)
    }

    __save(key, value, config) {
        const parts = key.split(".");
        const currentKey = parts[0];

        if (parts.length === 1) {
            config[currentKey] = value;
            return
        } else {
            if (!config.hasOwnProperty(currentKey)) {
                config[currentKey] = {};
            }
            const remainingKey = parts.slice(1).join(".");
            this.__save(remainingKey, value, config[currentKey]);
        }

        localStorage.setItem(currentKey, JSON.stringify(persistedConfig[currentKey]));
    }

    getPersistConfig(key) {
        const parts = key.split(".");
        let config = persistedConfig;

        for (let p of parts) {
            if (!config.hasOwnProperty(p)) {
                return null;
            }
            config = config[p];
        }

        return config;
    }

    clearPersistConfig(key) {
        const parts = key.split(".");
        const firstKey = parts[0];

        if (persistedConfig.hasOwnProperty(firstKey)) {
            const config = persistedConfig[firstKey];

            if (parts.length === 1) {
                delete persistedConfig[firstKey];
                return
            } else {
                const remainingKey = parts.slice(1).join(".");
                this.__clearNestedConfig(remainingKey, config);
            }

            localStorage.removeItem(firstKey);
        }
    }

    __clearNestedConfig(key, config) {
        const parts = key.split(".");
        const currentKey = parts[0];

        if (parts.length === 1) {
            delete config[currentKey];
        } else {
            const remainingKey = parts.slice(1).join(".");
            if (config.hasOwnProperty(currentKey)) {
                this.__clearNestedConfig(remainingKey, config[currentKey]);
            }
        }
    }

}