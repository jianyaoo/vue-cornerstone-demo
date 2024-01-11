"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DEFAULT_SETTINGS = Symbol('DefaultSettings');
const RUNTIME_SETTINGS = Symbol('RuntimeSettings');
const OBJECT_SETTINGS_MAP = Symbol('ObjectSettingsMap');
const DICTIONARY = Symbol('Dictionary');
class Settings {
    constructor(base) {
        const dictionary = Object.create((base instanceof Settings && DICTIONARY in base
            ? base[DICTIONARY]
            : null));
        Object.seal(Object.defineProperty(this, DICTIONARY, {
            value: dictionary,
        }));
    }
    set(key, value) {
        return set(this[DICTIONARY], key, value, null);
    }
    get(key) {
        return get(this[DICTIONARY], key);
    }
    unset(key) {
        return unset(this[DICTIONARY], key + '');
    }
    forEach(callback) {
        iterate(this[DICTIONARY], callback);
    }
    extend() {
        return new Settings(this);
    }
    import(root) {
        if (isPlainObject(root)) {
            Object.keys(root).forEach((key) => {
                set(this[DICTIONARY], key, root[key], null);
            });
        }
    }
    dump() {
        const context = {};
        iterate(this[DICTIONARY], (key, value) => {
            if (typeof value !== 'undefined') {
                deepSet(context, key, value);
            }
        });
        return context;
    }
    static assert(subject) {
        return subject instanceof Settings
            ? subject
            : Settings.getRuntimeSettings();
    }
    static getDefaultSettings(subfield = null) {
        let defaultSettings = Settings[DEFAULT_SETTINGS];
        if (!(defaultSettings instanceof Settings)) {
            defaultSettings = new Settings();
            Settings[DEFAULT_SETTINGS] = defaultSettings;
        }
        if (subfield) {
            const settingObj = {};
            defaultSettings.forEach((name) => {
                if (name.startsWith(subfield)) {
                    const setting = name.split(`${subfield}.`)[1];
                    settingObj[setting] = defaultSettings.get(name);
                }
            });
            return settingObj;
        }
        return defaultSettings;
    }
    static getRuntimeSettings() {
        let runtimeSettings = Settings[RUNTIME_SETTINGS];
        if (!(runtimeSettings instanceof Settings)) {
            runtimeSettings = new Settings(Settings.getDefaultSettings());
            Settings[RUNTIME_SETTINGS] = runtimeSettings;
        }
        return runtimeSettings;
    }
    static getObjectSettings(subject, from) {
        let settings = null;
        if (subject instanceof Settings) {
            settings = subject;
        }
        else if (typeof subject === 'object' && subject !== null) {
            let objectSettingsMap = Settings[OBJECT_SETTINGS_MAP];
            if (!(objectSettingsMap instanceof WeakMap)) {
                objectSettingsMap = new WeakMap();
                Settings[OBJECT_SETTINGS_MAP] = objectSettingsMap;
            }
            settings = objectSettingsMap.get(subject);
            if (!(settings instanceof Settings)) {
                settings = new Settings(Settings.assert(Settings.getObjectSettings(from)));
                objectSettingsMap.set(subject, settings);
            }
        }
        return settings;
    }
    static extendRuntimeSettings() {
        return Settings.getRuntimeSettings().extend();
    }
}
exports.default = Settings;
function unset(dictionary, name) {
    if (name.endsWith('.')) {
        let deleteCount = 0;
        const namespace = name;
        const base = namespace.slice(0, -1);
        const deleteAll = base.length === 0;
        for (const key in dictionary) {
            if (Object.prototype.hasOwnProperty.call(dictionary, key) &&
                (deleteAll || key.startsWith(namespace) || key === base)) {
                delete dictionary[key];
                ++deleteCount;
            }
        }
        return deleteCount > 0;
    }
    return delete dictionary[name];
}
function iterate(dictionary, callback) {
    for (const key in dictionary) {
        callback(key, dictionary[key]);
    }
}
function setAll(dictionary, prefix, record, references) {
    let failCount;
    if (references.has(record)) {
        return set(dictionary, prefix, null, references);
    }
    references.add(record);
    failCount = 0;
    for (const field in record) {
        if (Object.prototype.hasOwnProperty.call(record, field)) {
            const key = field.length === 0 ? prefix : `${prefix}.${field}`;
            if (!set(dictionary, key, record[field], references)) {
                ++failCount;
            }
        }
    }
    references.delete(record);
    return failCount === 0;
}
function set(dictionary, key, value, references) {
    if (isValidKey(key)) {
        if (isPlainObject(value)) {
            return setAll(dictionary, key, value, references instanceof WeakSet ? references : new WeakSet());
        }
        dictionary[key] = value;
        return true;
    }
    return false;
}
function get(dictionary, key) {
    return dictionary[key];
}
function isValidKey(key) {
    let last, current, previous;
    if (typeof key !== 'string' || (last = key.length - 1) < 0) {
        return false;
    }
    previous = -1;
    while ((current = key.indexOf('.', previous + 1)) >= 0) {
        if (current - previous < 2 || current === last) {
            return false;
        }
        previous = current;
    }
    return true;
}
function isPlainObject(subject) {
    if (typeof subject === 'object' && subject !== null) {
        const prototype = Object.getPrototypeOf(subject);
        if (prototype === Object.prototype || prototype === null) {
            return true;
        }
    }
    return false;
}
function deepSet(context, key, value) {
    const separator = key.indexOf('.');
    if (separator >= 0) {
        const subKey = key.slice(0, separator);
        let subContext = context[subKey];
        if (typeof subContext !== 'object' || subContext === null) {
            const subContextValue = subContext;
            subContext = {};
            if (typeof subContextValue !== 'undefined') {
                subContext[''] = subContextValue;
            }
            context[subKey] = subContext;
        }
        deepSet(subContext, key.slice(separator + 1, key.length), value);
    }
    else {
        context[key] = value;
    }
}
Settings.getDefaultSettings().set('useCursors', true);
//# sourceMappingURL=Settings.js.map