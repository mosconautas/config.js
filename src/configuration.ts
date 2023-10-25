export interface IConfiguration
    extends IGetConfiguration,
        IGetEnvironmentConfiguration,
        ISetConfiguration,
        IHasConfiguration,
        IConfigurationLoader,
        IUnsetConfiguration,
        IClearConfiguration {}

export interface IGetConfiguration {
    /**
     * @description Get a configuration value.
     * @example
     * // config.json
     * {
     *  port: 8080,
     *  logger: {
     *    level: "debug"
     *  }
     * }
     *
     * // main.ts
     * config.get("port") // 8080
     * config.get("logger") // { level: "debug" }
     * config.get("logger.level") // "debug"
     * config.get(["logger", "level"]) // debug
     */
    get<T = any>(key: string | string[], options?: { transform?: (value: string) => T }): T | null;
    get<T = any>(key: string | string[], options?: { transform?: (value: string) => T; defaultValue: T }): T;
}

export interface IGetEnvironmentConfiguration {
    getEnv<T = string>(key: string, options?: { transform?: (value: string) => T }): T | null;
    getEnv<T = string>(key: string, options?: { transform?: (value: string) => T; defaultValue: T }): T;
}

export interface ISetConfiguration {
    /**
     * @description Set a configuration value.
     */
    set<T>(key: string, value: T): T;
}

export interface IUnsetConfiguration {
    /**
     * @description Unset a configuration value.
     */
    unset(key: string): boolean;
}

export interface IHasConfiguration {
    /**
     * @description Check if a configuration value exists.
     */
    has(key: string): boolean;
}

export interface IClearConfiguration {
    /**
     * @description Clear all configuration values.
     */
    clear(): void;
}

export interface IConfigurationLoader {
    load(source: object): void;

    loadFromEnv(file?: string, override?: boolean): void;
    loadFromXml(xml: string): void;
    loadFromYml(yaml: string): void;
    loadFromYaml(yaml: string): void;
    loadFromToml(toml: string): void;
    loadFromJSON(json: string): void;
    loadFromFile(file: string): void;
}
