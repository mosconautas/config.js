import dotenv from "dotenv";
import { existsSync, readFileSync } from "fs";
import cloneDeep from "lodash/cloneDeep";
import extend from "lodash/extend";
import { IConfigurationLoader } from "../configuration";

export abstract class ConfigurationLoader implements IConfigurationLoader {
    protected _source: object = {};

    public get source(): object {
        return cloneDeep(this._source);
    }

    public load(source: object): void {
        this._source = extend(this._source, source);
    }

    public loadFromFile(file: string): void {
        if (existsSync(file) === false) {
            throw new Error(`Configuration file not found: ${file}`);
        }

        const extension = file.split(".").pop();
        const text = readFileSync(file, "utf8");

        switch (extension) {
            case ".env":
                return this.loadFromEnv(text);
            case "yml":
            case "yaml":
                return this.loadFromYml(text);
            case "xml":
                return this.loadFromXml(text);
            case "toml":
                return this.loadFromToml(text);
            case "json":
                return this.loadFromJSON(text);
            default:
                throw new Error(`Unsupported configuration file extension: ${extension}`);
        }
    }

    public loadFromEnv(env: string) {
        this.load(dotenv.parse(env));
    }

    public loadFromXml(xml: string): void {
        require("xml2js").parseString(xml, (error: Error, result: object) => {
            if (error) {
                throw error;
            }

            this.load(result);
        });
    }

    public loadFromYml(yaml: string): void {
        require("js-yaml").loadAll(yaml, (doc: object) => {
            this.load(doc);
        });
    }

    public loadFromYaml(yaml: string): void {
        this.loadFromYml(yaml);
    }

    public loadFromToml(toml: string): void {
        this.load(require("toml").parse(toml));
    }

    public loadFromJSON(json: string): void {
        this.load(JSON.parse(json));
    }
}
