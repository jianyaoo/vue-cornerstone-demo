export default class Settings {
    constructor(base?: Settings);
    set(key: string, value: unknown): boolean;
    get(key: string): unknown;
    unset(key: string): boolean;
    forEach(callback: (key: string, value: unknown) => void): void;
    extend(): Settings;
    import(root: Record<string, unknown>): void;
    dump(): Record<string, unknown>;
    static assert(subject: Settings): Settings;
    static getDefaultSettings(subfield?: any): Settings | any;
    static getRuntimeSettings(): Settings;
    static getObjectSettings(subject: unknown, from?: unknown): Settings;
    static extendRuntimeSettings(): Settings;
}
//# sourceMappingURL=Settings.d.ts.map