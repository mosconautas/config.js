/** @type {import('jest').Config} */
module.exports = {
    rootDir: process.cwd(),
    resetMocks: true,
    clearMocks: true,
    transform: {
        "^.+\\.ts?$": "@swc/jest",
    },
    testPathIgnorePatterns: [
        "/node_modules/",
        "/dist/",
    ],
    coveragePathIgnorePatterns: [
        "/node_modules/",
        "/dist/",
        "/coverage/",
        "/factories/",
        "/mocks/"
    ]
};