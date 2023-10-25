import { writeFileSync } from "fs";
import { tmpdir } from "os";
import { Configuration } from "../src";

describe(Configuration.name, () => {
    let sut: Configuration;

    beforeAll(() => {
        sut = Configuration.instance;
    });

    beforeEach(() => {
        sut.clear();
        sut.load({
            port: 8080,
            logger: {
                level: "debug",
            },
        });
    });

    describe("get", () => {
        it("should return the value of a key", () => {
            expect(sut.get("port")).toBe(8080);
            expect(sut.get("logger")).toEqual({ level: "debug" });
            expect(sut.get("logger.level")).toBe("debug");
            expect(sut.get(["logger", "level"])).toBe("debug");
        });

        it("should return the default value of a key", () => {
            expect(sut.get("foo", { defaultValue: "bar" })).toBe("bar");
        });

        it("should return null if the key does not exist", () => {
            expect(sut.get("foo")).toBeNull();
        });

        it("should return the transformed value of a key", () => {
            sut.set("port", "3000");

            expect(sut.get("port", { transform: Number })).toBe(3000);
        });
    });

    describe("set", () => {
        it("should set the value of a key", () => {
            expect(sut.get("foo")).toBeNull();

            sut.set("foo", "bar");

            expect(sut.get("foo")).toBe("bar");
        });
    });

    describe("unset", () => {
        it("should unset the value of a key", () => {
            expect(sut.get("port")).toBe(8080);

            sut.unset("port");

            expect(sut.get("port")).toBeNull();
        });
    });

    describe("has", () => {
        it("should return true if the key exists", () => {
            expect(sut.has("port")).toBe(true);
        });

        it("should return false if the key does not exist", () => {
            expect(sut.has("foo")).toBe(false);
        });
    });

    describe("clear", () => {
        it("should clear all configuration values", () => {
            expect(sut.get("port")).toBe(8080);

            sut.clear();

            expect(sut.get("port")).toBeNull();
        });
    });

    describe("getEnv", () => {
        it("should return the value of an environment variable", () => {
            expect(sut.getEnv("NODE_ENV")).toBe("test");
        });

        it("should return the default value of an environment variable", () => {
            expect(sut.getEnv("foo", { defaultValue: "bar" })).toBe("bar");
        });

        it("should return null if the environment variable does not exist", () => {
            expect(sut.getEnv("foo")).toBeNull();
        });

        it("should return the transformed value of an environment variable", () => {
            process.env.PORT = "8080";

            expect(sut.getEnv("PORT", { transform: Number })).toBe(8080);
        });
    });

    describe("load", () => {
        it("should load a configuration object", () => {
            expect(sut.get("port")).toBe(8080);
        });

        it("should override existing configuration values", () => {
            expect(sut.get("port")).toBe(8080);

            sut.load({ port: 3000 });

            expect(sut.get("port")).toBe(3000);
        });

        it("should load a configuration file", () => {
            const file = `${tmpdir()}/config.json`;

            writeFileSync(file, JSON.stringify({ port: 3000 }));

            sut.loadFromFile(file);

            expect(sut.get("port")).toBe(3000);
        });

        it("should load a configuration file from environment variable", () => {
            sut.loadFromEnv("PORT=8080");

            expect(sut.getEnv("PORT")).toBe("8080");
        });

        it("should load a configuration file form yaml", () => {
            sut.loadFromYaml("port: 3000");

            expect(sut.get("port")).toBe(3000);
        });

        it("should load a configuration file form yml", () => {
            sut.loadFromYml("port: 3000");

            expect(sut.get("port")).toBe(3000);
        });

        it("should load a configuration file form toml", () => {
            sut.loadFromToml("port = 3000");

            expect(sut.get("port")).toBe(3000);
        });

        it("should load a configuration file form xml", () => {
            sut.loadFromXml("<port>3000</port>");

            expect(sut.get("port", { transform: Number })).toBe(3000);
        });

        it("should throw an error if the file extension is not supported", () => {
            const file = `${tmpdir()}/config.txt`;

            writeFileSync(file, JSON.stringify({ port: 3000 }));

            expect(() => sut.loadFromFile(file)).toThrowError("Unsupported configuration file extension: txt");
        });

        it("should throw an error if the file does not exist", () => {
            expect(() => sut.loadFromFile("foo.json")).toThrowError("Configuration file not found: foo.json");
        });
    });
});
