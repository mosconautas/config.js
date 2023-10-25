import get from "lodash/get";
import has from "lodash/has";
import set from "lodash/set";
import unset from "lodash/unset";
import { IConfiguration } from "../configuration";
import { ConfigurationLoader } from "./configuration-loader";

export class Configuration extends ConfigurationLoader implements IConfiguration {
    private static _instance: Configuration;
    public static get instance(): Configuration {
        if (!this._instance) {
            this._instance = new Configuration();
        }

        return this._instance;
    }

    private constructor() {
        super();
    }

    public getEnv<T = string>(key: string, options?: { transform?: (value: string) => T }): T | null;
    public getEnv<T = string>(key: string, options?: { transform?: (value: string) => T; defaultValue: T }): T;
    public getEnv<T = string>(): unknown | null {
        const key = arguments[0] as string;
        const options = arguments[1] as { transform?: (value: string) => T; defaultValue?: T };

        const value = process.env[key];

        if (value === undefined) {
            return options?.defaultValue ?? null;
        }

        return options?.transform ? options.transform(value) : value;
    }

    public get<T = any>(key: string | string[], options?: { transform?: (value: string) => T }): T | null;
    public get<T = any>(key: string | string[], options?: { transform?: (value: string) => T; defaultValue: T }): T;
    public get<T = any>(
        key: string | string[],
        options?: { transform: (value: string) => T; defaultValue: T }
    ): T | null {
        const value = get<any, any>(this._source, key) ?? null;

        if (value === null) {
            return options?.defaultValue ?? null;
        }

        return options?.transform ? options.transform(value) : value;
    }

    public set<T>(key: string, value: T): T {
        return set<T>(this._source, key, value);
    }

    public unset(key: string): boolean {
        return unset(this._source, key);
    }

    public has(key: string): boolean {
        return has(this._source, key);
    }

    public clear(): void {
        this._source = {};
    }
}
